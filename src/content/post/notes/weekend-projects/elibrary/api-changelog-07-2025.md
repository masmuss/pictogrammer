---
title: "Studi Kasus: Dari Audit Log hingga Uji Beban pada API E-Library - Weekend Projects"
description: Catatan teknis tentang hardening API E-Library, mulai dari audit log hingga load testing untuk menemukan dan memperbaiki bottleneck.
date: 16 July 2025
tags: ["tech"]
---

Pada [artikel sebelumnya](/blog/notes/weekend-projects/elibrary/api), saya telah membedah arsitektur dasar dari proyek E-Library API yang saya bangun menggunakan Hono, Bun, dan Drizzle. Saat itu, fokus utamanya adalah membuat fungsionalitas inti berjalan dengan baik. Namun, sebuah aplikasi yang siap untuk produksi membutuhkan lebih dari sekadar fitur yang berfungsi; ia memerlukan ketangguhan (resilience), keamanan, dan performa yang teruji.

Artikel ini adalah catatan teknis tentang proses hardening API tersebut, mulai dari implementasi audit log hingga siklus load testing untuk menemukan dan memperbaiki bottleneck.

## Bagian 1: Membangun Fondasi Keamanan dengan Audit Log

Setiap aksi penting dalam sebuah sistem harus dapat dilacak. Siapa yang mengubah data? Kapan? Data apa yang diubah? Untuk menjawab pertanyaan ini, saya mengimplementasikan sebuah sistem audit log yang tangguh.

### Arsitektur Logging

Pendekatan yang saya ambil adalah menggunakan middleware terpusat di Hono. Ini memungkinkan setiap permintaan yang masuk ke endpoint krusial dapat dicatat secara otomatis tanpa mengotori logika bisnis di dalam handler.

Setiap catatan log disimpan di tabel `audit_logs` baru dan berisi informasi yang kaya:

- `userId`: Siapa yang melakukan aksi.
- `action`: Aksi spesifik yang dilakukan (misalnya, `BOOK_CREATE`, `USER_LOGIN`), dikelola menggunakan TypeScript Enums untuk konsistensi.
- `status`: Hasil dari aksi tersebut (`SUCCESS` atau `FAILED`), yang ditentukan tidak hanya dari exception tetapi juga dari kode status respons HTTP.
- `payload`: Seluruh request body dalam format JSON, berguna untuk mereplikasi masalah.
- `dbQuery`: Query SQL mentah yang dieksekusi oleh Drizzle, memberikan visibilitas penuh ke level database.
- `correlationId`: Sebuah ID unik untuk setiap permintaan HTTP, memungkinkan pelacakan semua log yang berasal dari satu aksi pengguna.

Dengan arsitektur ini, kita mendapatkan jejak audit yang sangat detail untuk setiap perubahan data, memberikan lapisan keamanan dan akuntabilitas yang esensial.

## Bagian 2: Menguji Batas Kemampuan dengan Artillery.io

Sebuah aplikasi mungkin berjalan lancar dengan satu pengguna, tetapi bagaimana jika seratus pengguna mengaksesnya secara bersamaan? Di sinilah uji beban berperan. Saya memilih Artillery.io karena kemudahannya dalam mendefinisikan skenario menggunakan YAML.

Proses ini tidak berjalan mulus dan memberikan beberapa pelajaran teknis yang berharga.Skenario Uji BebanUntuk menguji API, saya membuat skenario `load-test.yml` yang mensimulasikan alur kerja pengguna tamu. Skenario ini mencakup beberapa langkah: melihat daftar kategori, melihat daftar buku, melihat detail satu buku, dan terakhir mencoba mendaftar sebagai pengguna baru dengan data acak.

```yaml title=load-test.yml
config:
  target: "http://localhost:3000"
  phases:
    - duration: 30
      arrivalRate: 5
      name: "Warm-up Phase"
    - duration: 60
      arrivalRate: 20
      name: "Peak Load Phase"
  variables:
    username:
      - "{{ $randomString(10) }}"
    email:
      - "{{ $randomString(8) }}@test.com"
    password:
      - "securePassword123"
    name:
      - "User {{ $randomString(5) }}"
    bookId:
      - 1

scenarios:
  - name: "Guest User Browsing Catalog and Registering"
    flow:
      - get:
          url: "/api/categories"
      - think: 2

      - get:
          url: "/api/books"
      - think: 3

      - get:
          url: "/api/books/{{ bookId }}"
      - think: 2

      - post:
          url: "/api/auth/register"
          json:
            username: "{{ username }}"
            email: "{{ email }}"
            password: "{{ password }}"
            name: "{{ name }}"
```

### Percobaan Pertama: Kegagalan Total

Uji beban pertama saya gagal total. Laporan Artillery menunjukkan 100% permintaan gagal dengan error `422 Unprocessable Entity` dan `429 Too Many Requests`. Awalnya, saya menduga ada yang salah dengan skrip Artillery.

Namun, setelah investigasi mendalam, akar masalahnya adalah **ketidakcocokan data**. Skrip unit test saya (`bun run test`) selalu membersihkan dan membuat data acak, sementara load test berjalan terhadap server pengembangan yang databasenya tidak memiliki pengguna statis (`admin`, `member`) yang didefinisikan di file `.env`. Akibatnya, semua upaya login gagal di tahap validasi.

**Pelajaran**: Pastikan lingkungan pengujian kalian memiliki data yang konsisten dan dapat diprediksi. Solusinya adalah membuat skrip `db:seed` khusus yang dijalankan sebelum setiap sesi uji beban.

### Percobaan Kedua: Menemukan Bottleneck Sebenarnya

Setelah memperbaiki masalah data dengan skrip seeding, pengujian berhasil melewati tahap login. Namun, masalah baru muncul: `500 Internal Server Error` saat beban mulai meningkat.

Ini adalah "kabar baik" yang menyakitkan. Artinya, kita telah berhasil membebani aplikasi hingga titik lemahnya terungkap. Berdasarkan waktu respons yang sangat tinggi untuk error `500` (mencapai ~1 detik), hipotesis utama saya adalah **kelelahan pool koneksi database** atau **race condition** saat beberapa pengguna mencoba mendaftar secara bersamaan.

### Solusi: Menangani Race Condition

Penyebabnya ternyata adalah _race condition_ pada endpoint registrasi. Dua permintaan yang datang bersamaan sama-sama lolos dari pengecekan `isUserExists`, tetapi salah satunya gagal saat `INSERT` karena melanggar batasan `UNIQUE` di PostgreSQL. Error dari database ini tidak ditangani dengan baik dan menyebabkan crash aplikasi.

Solusinya adalah dengan membungkus logika `INSERT` di dalam blok `try...catch` pada `UserRepository` dan secara spesifik menangani error dengan kode `23505 (unique violation)`. Jika error ini terjadi, aplikasi sekarang akan mengembalikan respons `409 Conflict`, bukan `500 Internal Server Error`.

## Hasil Akhir: Aplikasi yang Stabil dan Cepat

Setelah perbaikan tersebut, saya menjalankan kembali uji beban dengan _rate limiter_ yang dilonggarkan untuk benar-benar menguji kapasitas aplikasi. Hasilnya sangat memuaskan.

| Metrik Kunci                  | Rate Limiter ON | Rate Limiter OFF |
| ----------------------------- | --------------- | ---------------- |
| Permintaan Sukses (2xx)       | 94              | 4,051            |
| Error 500 (Internal Server)   | 6               | 0                |
| Error 409 (Konflik/Duplikat)  | 6               | 1,349            |
| Waktu Respons Rata-rata (2xx) | 18.2 ms         | 3.8 ms           |
| Latensi P99 (2xx)             | 87.4 ms         | 13.9 ms          |

Seperti yang terlihat pada tabel perbandingan di dokumen Analisis Final & Perbandingan Uji Beban, aplikasi kini sepenuhnya stabil (`http.codes.500: 0`) dan sangat cepat, dengan waktu respons rata-rata di bawah 4 milidetik bahkan di bawah beban tinggi.

Seluruh kode dari proyek ini bersifat open-source dan tersedia di GitHub dan bisa diakses di link dibawah.

::github{repo="masmuss/hono-elibrary"}
