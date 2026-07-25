---
title: "Studi Kasus: Dari Audit Log hingga Uji Beban pada API E-Library - Weekend Projects"
description: Catatan teknis tentang hardening API E-Library, mulai dari audit log hingga load testing untuk menemukan dan memperbaiki bottleneck.
date: 16 July 2025
tags: ["tech", "devlog", "backend", "bun", "testing"]
---

Di [artikel sebelumnya](/blog/notes/weekend-projects/elibrary/api), aku sudah membedah arsitektur dasar E-Library API yang kubangun dengan Hono, Bun, dan Drizzle. Saat itu fokusnya: bikin semua fitur inti berjalan.

Tapi aplikasi yang siap produksi butuh lebih dari sekadar fitur yang berfungsi. Ia perlu ketangguhan, keamanan, dan performa yang teruji. Artikel ini catatan teknis proses hardening-nya.

## Bagian 1: Audit Log

Setiap aksi penting harus bisa dilacak. Siapa yang mengubah data? Kapan? Data apa yang berubah?

Aku implementasi sistem audit log lewat middleware terpusat di Hono. Setiap request ke endpoint krusial dicatat otomatis tanpa mengotori logika bisnis. Tabel `audit_logs` menyimpan:

- `userId` — siapa yang bertindak
- `action` — aksi spesifik (`BOOK_CREATE`, `USER_LOGIN`), pakai TypeScript Enums
- `status` — `SUCCESS` atau `FAILED`, ditentukan dari kode status HTTP
- `payload` — seluruh request body dalam JSON
- `dbQuery` — query SQL mentah dari Drizzle
- `correlationId` — ID unik per request untuk melacak semua log dari satu aksi

Dengan ini, jejak audit sangat detail — penting untuk debugging dan akuntabilitas.

## Bagian 2: Load Testing dengan Artillery

Aplikasi lancar dengan satu user. Bagaimana dengan seratus?

Aku pakai **Artillery.io** — simpel, skenario ditulis dalam YAML. Prosesnya tidak mulus dan memberi beberapa pelajaran berharga.

### Skenario Uji Beban

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

### Percobaan Pertama: Gagal Total

Hasil pertama: 100% request gagal — `422 Unprocessable Entity` dan `429 Too Many Requests`. Aku kira skrip Artillery-nya yang salah.

Setelah investigasi, akar masalahnya: **ketidakcocokan data**. Unit test (`bun run test`) membersihkan dan membuat data acak, sementara load test berjalan melawan server development yang tidak punya user statis (`admin`, `member`) dari `.env`. Semua login gagal di validasi.

Solusi: bikin skrip `db:seed` khusus yang dijalankan sebelum setiap sesi load test.

### Percobaan Kedua: Race Condition

Setelah data fix, pengujian lolos login. Tapi muncul masalah baru: `500 Internal Server Error` saat beban naik.

Penyebabnya: **race condition** di endpoint registrasi. Dua request bersamaan sama-sama lolos pengecekan `isUserExists`, tapi salah satu gagal saat `INSERT` karena melanggar constraint `UNIQUE` di PostgreSQL. Error ini tidak ditangani dengan baik → crash.

Solusi: bungkus `INSERT` dalam `try...catch` di `UserRepository` dan tangani spesifik error `23505 (unique violation)`. Sekarang aplikasi return `409 Conflict`, bukan `500`.

## Hasil Akhir

Setelah perbaikan, load test dijalankan ulang dengan rate limiter dilonggarkan:

| Metrik                        | Rate Limiter ON | Rate Limiter OFF |
| ----------------------------- | --------------- | ---------------- |
| Permintaan Sukses (2xx)       | 94              | 4,051            |
| Error 500                     | 6               | 0                |
| Error 409 (Konflik)           | 6               | 1,349            |
| Waktu Respons Rata-rata (2xx) | 18.2 ms         | 3.8 ms           |
| Latensi P99 (2xx)             | 87.4 ms         | 13.9 ms          |

Aplikasi stabil (`http.codes.500: 0`) dan sangat cepat — rata-rata di bawah 4 milidetik di bawah beban tinggi.

Kode lengkap open-source di GitHub:

::github{repo="masmuss/hono-elibrary"}
