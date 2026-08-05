---
title: "Becoming Gopher #4 — Mengulang Perintah: Mengenal Perulangan For dan Array"
description: Pelajari satu-satunya perulangan di Go, for, dan cara pertama kita untuk menyimpan sekumpulan data sejenis secara berurutan dengan array.
date: 4 August 2025
tags: ["tech", "golang"]
---

Selamat datang kembali di petualangan **Becoming Gopher**! Di [episode sebelumnya](./otak-program-logika-percabangan-dengan-if-dan-switch), kita sudah sukses memberikan 'otak' pada program kita. Kode kita sekarang bisa menganalisis kondisi dan memilih jalan yang berbeda menggunakan `if` dan `switch`.

Seorang petualang seringkali harus melakukan hal yang sama berulang kali—berjalan ribuan langkah, mendayung puluhan kali, atau memeriksa setiap barang di dalam tas. Program kita juga butuh kemampuan itu. Jika tidak, bagaimana kita bisa memproses ratusan data pengguna atau menampilkan daftar produk satu per satu?

Hari ini, kita akan melatih 'stamina' program kita. Kita akan berkenalan dengan:

1.  **`Array`**: 'Rak penyimpanan' pertama kita untuk menampung banyak data sejenis secara terorganisir.
2.  **`For`**: Satu-satunya 'mesin pengulang' di Go yang akan membuat program kita bisa bekerja secara efisien tanpa perlu menulis kode yang sama berulang kali.

Siapkan staminamu, karena kita akan membuat program yang jauh lebih efisien. Ayo kita mulai!

## `Array`: Rak Penyimpanan Data Pertama Kita

Bayangkan kamu ingin menyimpan daftar belanjaan: "apel", "roti", "susu". Membuat tiga variabel berbeda (`belanjaan1`, `belanjaan2`, `belanjaan3`) tentu sangat tidak praktis. Di sinilah `array` datang sebagai penyelamat.

**Array** adalah tipe data yang berisi kumpulan data dengan **tipe yang sama** dan **ukuran yang sudah pasti**.

Bayangkan `array` seperti sebuah rak buku dengan jumlah slot yang sudah ditentukan. Jika rak punya 5 slot, kamu hanya bisa menaruh 5 buku, tidak lebih dan tidak kurang.

### Membuat dan Menggunakan Array

Untuk membuat array, kita tentukan jumlah slot dan tipe datanya.

```go
// Membuat array untuk menampung 3 nama (string)
var namaTeman [3]string

// Mengisi setiap "slot" array
namaTeman[0] = "Budi"
namaTeman[1] = "Citra"
namaTeman[2] = "Eka"

// Mengakses data di slot tertentu
fmt.Println("Teman pertama:", namaTeman[0]) // Teman pertama: Budi
fmt.Println("Teman ketiga:", namaTeman[2]) // Teman ketiga: Eka
```

:::note
Penting: Penomoran slot (disebut index) di Go selalu dimulai dari 0, bukan 1.
:::

Kita juga bisa langsung mengisi array saat membuatnya.

```go
// Membuat array nilai dengan 5 slot yang langsung diisi
nilaiUjian := [5]int{80, 90, 75, 100, 85}

fmt.Println("Nilai kedua:", nilaiUjian[1]) // Nilai kedua: 90
fmt.Println("Panjang array:", len(nilaiUjian)) // Panjang array: 5
```

Jika malas menghitung jumlah datanya, kita bisa gunakan `[...]` dan biarkan Go yang menghitungnya untuk kita.

```go
// Go akan otomatis tahu bahwa array ini berukuran 4
hari := [...]string{"Senin", "Selasa", "Rabu", "Kamis"}
```

Meskipun berguna, keterbatasan utama `array` adalah ukurannya yang kaku dan tidak bisa diubah. Inilah alasan mengapa nanti kita akan belajar tipe data lain yang lebih fleksibel.

## `For` Loop: Mesin Pengulang Serbaguna

Sekarang kita punya array yang berisi banyak data. Bagaimana cara kita melihat semua isinya satu per satu tanpa menulis fmt.Println() berkali-kali? Jawabannya adalah dengan perulangan atau loop.

Di Go, hanya ada satu kata kunci untuk perulangan: `for`. Tapi jangan salah, `for` di Go sangat serbaguna dan bisa berperan seperti `while` atau `foreach` di bahasa lain.

### `For` Loop Klasik (dengan Counter)

Ini adalah bentuk paling umum yang mungkin pernah kamu lihat di bahasa lain. Strukturnya terdiri dari tiga bagian yang dipisahkan titik koma:

- **init**: Pernyataan awal (misal: `i := 0`), dijalankan sekali sebelum loop dimulai.
- **condition**: Kondisi yang dicek setiap awal iterasi. Jika `true`, loop lanjut. Jika `false`, loop berhenti.
- **post**: Pernyataan yang dijalankan setiap akhir iterasi (misal: `i++`).

```go
// Loop dari 1 sampai 5
for i := 1; i <= 5; i++ {
    fmt.Println("Lompatan ke-", i)
}
// Output:
// Lompatan ke- 1
// Lompatan ke- 2
// Lompatan ke- 3
// Lompatan ke- 4
// Lompatan ke- 5
```

### `For` Loop Gaya While

Jika kita menghilangkan bagian `init` dan `post`, `for` loop akan berfungsi seperti `while` loop. Ia akan terus berjalan selama kondisinya `true`.

```go
angka := 1
for angka < 5 {
    fmt.Println("Angka saat ini:", angka)
    angka = angka * 2
}
// Output:
// Angka saat ini: 1
// Angka saat ini: 2
// Angka saat ini: 4
```

### `For-Range`: Cara Terbaik untuk Koleksi Data

Ini adalah cara paling "Go-like" dan paling nyaman untuk melakukan perulangan pada `array` (dan nanti pada `slice` serta `map`). `for-range` akan otomatis memberikan kita **index** dan **value** dari setiap elemen.

```go
// Menggunakan array 'hari' yang sudah kita buat sebelumnya
hari := [...]string{"Senin", "Selasa", "Rabu", "Kamis"}

for index, namaHari := range hari {
    fmt.Printf("Hari ke-%d adalah %s\n", index+1, namaHari)
}
```

Jika kamu tidak butuh index-nya, kamu bisa menggantinya dengan `_` (underscore).

```go
for _, namaHari := range hari {
    fmt.Println(namaHari)
}
```

## `Break` dan `Continue`: Mengontrol Alur Perulangan

Terkadang, kita perlu sedikit kontrol lebih di dalam loop.

- `break`: Digunakan untuk keluar paksa dari perulangan, bahkan jika kondisinya masih `true`.
- `continue`: Digunakan untuk menghentikan iterasi saat ini dan langsung loncat ke iterasi berikutnya.

```go
// Contoh penggunaan break dan continue
for i := 1; i <= 10; i++ {
    if i%2 == 0 {
        // Lewati semua angka genap
        continue
    }

    if i > 7 {
        // Jika angka sudah lebih dari 7, hentikan seluruh loop
        break
    }

    fmt.Println("Angka ganjil:", i)
}
// Output:
// Angka ganjil: 1
// Angka ganjil: 3
// Angka ganjil: 5
// Angka ganjil: 7
```

## Petualangan Hari Ini Selesai!

Hebat! Hari ini kita sudah menambahkan dua kemampuan super pada program kita: kemampuan untuk menyimpan banyak data dalam sebuah `array`, dan kemampuan untuk melakukan tugas berulang secara otomatis dengan `for` loop. Program kita kini jauh lebih efisien.

Singkatnya, kita sudah belajar:

- Menyimpan data sejenis dalam `array` dengan ukuran yang pasti.
- Menggunakan berbagai gaya `for` loop untuk kebutuhan yang berbeda.
- Cara paling elegan untuk mengiterasi `array` menggunakan `for-range`.
- Mengontrol alur perulangan dengan break dan continue.

Meskipun `array` berguna, ukurannya yang kaku seringkali menjadi batasan. Di petualangan berikutnya, kita akan bertemu dengan 'kakak super'-nya `array`, yaitu `slice`, dan juga struktur data super fleksibel bernama `map`. Ini akan benar-benar mengubah cara kita mengelola data di Go!

<!-- Punya pertanyaan atau ingin mencoba membuat perulangan versimu sendiri? Bagikan di kolom komentar! Sampai jumpa di bagian kelima! -->
