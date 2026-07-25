---
title: "Becoming Gopher #3 — Otak Program: Logika Percabangan dengan If & Switch"
description: Kita akan belajar cara menggunakan operator dan mengontrol alur program dengan if-else dan switch untuk membuat keputusan.
date: 3 August 2025
tags: ["tech", "golang"]
---

Selamat datang kembali di petualangan **Becoming Gophe**r! [Di bagian sebelumnya](./hello-gopher-kode-pertamamu-dan-tipe-data-dasar), kita sudah berhasil mengumpulkan 'bahan baku' kita: kita sudah tahu cara menyimpan angka, teks, dan logika benar/salah menggunakan variabel dan konstanta. Ransel kita sudah terisi!

Tapi, apa gunanya bahan baku jika hanya disimpan di dalam ransel? Seorang petualang sejati harus bisa mengolahnya untuk bertahan hidup. Hari ini, kita akan belajar cara 'meracik' bahan-bahan tersebut. Kita akan memberikan 'otak' pada program kita agar ia bisa berpikir, membandingkan kondisi, dan memilih jalan yang harus diambil.

Petualangan kita hari ini akan dibagi menjadi dua tahap utama:

1.  **Mengolah Data:** Kita akan mulai dengan **operasi** dasar—bagaimana cara menjumlahkan angka, membandingkan dua nilai, dan menggabungkan beberapa kondisi logika.
2.  **Membuat Keputusan:** Setelah itu, kita akan masuk ke inti dari 'otak' program: **percabangan**. Kita akan belajar menggunakan `if-else` untuk menghadapi satu pilihan dan `switch` untuk memilih dari banyak kemungkinan.

Pegang erat logikamu, karena kita akan mulai membuat program yang jauh lebih pintar dari sekadar barisan perintah. Mari kita berikan 'nyawa' pada kode kita!

## Operasi: Meracik Bahan Baku Kita

Sebelum program bisa membuat keputusan, ia harus bisa mengolah data terlebih dahulu. Ini seperti resep masakan: kita mencampur, membandingkan, dan menggabungkan bahan-bahan yang ada. Di Go, ada tiga jenis operasi dasar yang akan sering kita gunakan.

### 1. Operasi Matematika

Ini adalah operasi yang paling kita kenal. Go mendukung semua operasi aritmetika standar.

| Operator | Keterangan               |
| :------- | :----------------------- |
| `+`      | Penjumlahan              |
| `-`      | Pengurangan              |
| `*`      | Perkalian                |
| `/`      | Pembagian                |
| `%`      | Sisa Pembagian (modulus) |

```go
a := 10
b := 5
c := (a + b) / 3 // (10 + 5) / 3 = 5

fmt.Println(c) // Output: 5
```

Go juga menyediakan jalan pintas untuk operasi ke variabel itu sendiri (augmented assignments) dan operator tunggal (unary operator).

```go
x := 10
x += 5 // sama dengan x = x + 5, sekarang x menjadi 15

y := 5
y++ // sama dengan y = y + 1, sekarang y menjadi 6

fmt.Println("Nilai x:", x) // Nilai x: 15
fmt.Println("Nilai y:", y) // Nilai y: 6
```

### 2. Operasi Perbandingan

Inilah kunci dari pengambilan keputusan. Operasi perbandingan selalu menghasilkan nilai boolean (true atau false), yang nantinya akan kita gunakan di if atau switch.

| Operator | Keterangan              |
| :------- | :---------------------- |
| `>`      | Lebih Dari              |
| `<`      | Kurang Dari             |
| `>=`     | Lebih Dari Sama Dengan  |
| `<=`     | Kurang Dari Sama Dengan |
| `==`     | Sama Dengan             |
| `!=`     | Tidak Sama Dengan       |

```go
nilaiUjian := 85
lulus := nilaiUjian >= 75 // Apakah 85 lebih besar atau sama dengan 75?

fmt.Println("Status kelulusan:", lulus) // Status kelulusan: true
```

### 3. Operasi Logika

Operasi ini digunakan untuk menggabungkan beberapa hasil perbandingan.

| Operator | Keterangan                                                   |
| :------- | :----------------------------------------------------------- |
| `\|\|`   | Atau (salah satu kondisi harus true)                         |
| `&&`     | Dan (kedua kondisi harus true)                               |
| `!`      | Tidak (membalikkan nilai true menjadi false, dan sebaliknya) |

```go
absensi := 80
nilaiRataRata := 85

bolehIkutUjian := absensi > 75 && nilaiRataRata > 70 // true && true -> true

fmt.Println("Boleh ikut ujian?", bolehIkutUjian) // Boleh ikut ujian? true
```

## Konversi Tipe Data: Menyamakan Bahan Baku

Saat mengolah data, kadang kita menemukan situasi di mana tipe datanya tidak cocok. Misalnya, kita punya angka `int8` tapi ingin menambahkannya dengan `int32`. Go adalah bahasa yang sangat ketat (strongly typed), ia tidak akan mengizinkan operasi antara dua tipe yang berbeda.

Solusinya? Kita harus secara eksplisit mengonversi salah satu nilai agar tipenya sama.

```go
var nilaiA int8 = 100
var nilaiB int16 = 200

// Ini akan error: mismatched types int8 and int16
// var total = nilaiA + nilaiB

// Lakukan konversi
var total int16 = int16(nilaiA) + nilaiB
fmt.Println("Total:", total) // Total: 300
```

:::warning
Hati-hati saat mengonversi ke tipe data yang lebih kecil! Jika nilainya melebihi kapasitas tipe data tujuan, akan terjadi overflow (nilai akan "berputar" dan menjadi tidak terduga).
:::

```go
var angkaBesar int32 = 30000
var angkaKecil int8 = int8(angkaBesar)

fmt.Println("Angka Besar:", angkaBesar) // Angka Besar: 30000
fmt.Println("Angka Kecil:", angkaKecil) // Angka Kecil: 48 (nilai yang aneh akibat overflow)
```

## `If-Else`: Persimpangan Jalan Pertama

Sekarang kita sudah punya hasil dari operasi perbandingan (`true` atau `false`), kita bisa menggunakannya untuk membuat program memilih jalan. Inilah fungsi dari `if-else`, struktur percabangan paling dasar.

```go
umur := 17

if umur >= 17 {
    fmt.Println("Anda boleh membuat KTP.")
} else {
    fmt.Println("Anda belum cukup umur.")
}
```

Jika ada lebih dari dua kemungkinan, kita bisa menambahkan `else if`.

```go
nilai := 78

if nilai >= 90 {
    fmt.Println("Predikat: A")
} else if nilai >= 80 {
    fmt.Println("Predikat: B")
} else if nilai >= 70 {
    fmt.Println("Predikat: C")
} else {
    fmt.Println("Predikat: D")
}
// Output: Predikat: C
```

Go juga punya fitur keren bernama `short statement` pada `if`, di mana kita bisa mendeklarasikan variabel sementara yang hanya berlaku di dalam blok `if-else` tersebut.

```go
// `panjang` hanya bisa diakses di dalam blok if ini
if panjang := len("Gopher"); panjang > 5 {
    fmt.Println("Nama yang cukup panjang.")
} else {
    fmt.Println("Nama yang singkat.")
}
// Output: Nama yang cukup panjang.
```

## `Switch`: Peta dengan Banyak Pilihan

Bagaimana jika kita punya banyak sekali kondisi `else if`? Kode kita akan terlihat berantakan. Untuk kasus seperti ini, `switch` adalah solusi yang lebih bersih dan elegan. `Switch` akan mencocokkan sebuah nilai dengan beberapa kemungkinan case.

```go
hari := "Rabu"

switch hari {
case "Senin":
    fmt.Println("Semangat memulai minggu baru!")
case "Jumat":
    fmt.Println("Sedikit lagi weekend!")
case "Sabtu", "Minggu": // Bisa untuk beberapa case sekaligus
    fmt.Println("Saatnya bersantai!")
default:
    fmt.Println("Hari kerja biasa.")
}
// Output: Hari kerja biasa.
```

Sama seperti `if`, `switch` juga bisa digunakan tanpa ekspresi (seperti `if-else if` versi rapi) dan mendukung short statement.

```go
// Switch tanpa ekspresi
skor := 85
switch {
case skor >= 90:
    fmt.Println("Luar biasa!")
case skor >= 80:
    fmt.Println("Bagus!") // Ini yang akan dijalankan
default:
    fmt.Println("Coba lagi!")
}
// Output: Bagus!
```

## Petualangan Hari Ini Selesai!

Hari ini kita sudah berhasil memberikan 'otak' pada program kita. Perjalanan kita tidak lagi lurus-lurus saja; sekarang kode kita bisa memilih jalan dan bereaksi terhadap kondisi yang berbeda.

Secara singkat, kita sudah belajar:

- Melakukan operasi matematika, perbandingan, dan logika.
- Mengonversi tipe data agar bisa diolah bersama.
- Membuat keputusan sederhana dengan if-else.
- Menangani banyak pilihan secara elegan dengan switch.

Di petualangan selanjutnya, kita akan belajar cara membuat program kita melakukan tugas berulang-ulang tanpa lelah.
