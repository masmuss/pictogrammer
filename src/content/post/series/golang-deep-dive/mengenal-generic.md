---
title: "Becoming Gopher: Deep Dive #1 — Jurus Pamungkas: Mengenal Generics di Go"
description: "Pernah merasa menulis fungsi yang sama berulang kali untuk tipe data berbeda? Pelajari Generics, fitur modern Go untuk menulis kode yang fleksibel dan aman."
date: 12 August 2025
tags: ["tech", "golang"]
---

Selamat datang kembali, Gopher! Di [babak terakhir](/blog/series/golang-dasar/kamu-siap-proyek-pertama-dan-arah-selanjutnya-di-dunia-go), kita sudah menyelesaikan proyek pertama kita dan melihat sekilas ke arah konkurensi. Sebenarnya, petualangan inti kita sudah selesai... tapi ada satu 'jurus pamungkas' lagi yang sengaja kita simpan untuk episode spesial ini.

Ini adalah topik yang akan menjawab pertanyaan yang mungkin pernah muncul di benakmu...

## Mengapa Kita Butuh Generics?

Pernahkah kamu berpikir saat menulis kode, _"Duh, fungsi ini logikanya sama persis, tapi kenapa aku harus menulisnya dua kali hanya karena satu untuk `int` dan satu lagi untuk `float64`?"_

Misalnya, kita punya dua fungsi ini:

```go
func SumInts(numbers []int) int {
    var total int
    for _, n := range numbers {
        total += n
    }
    return total
}

func SumFloats(numbers []float64) float64 {
    var total float64
    for _, n := range numbers {
        total += n
    }
    return total
}
```

Logikanya 100% identik! Ini melanggar prinsip _Don't Repeat Yourself_ (DRY). Sebelum Go 1.18, solusinya adalah menggunakan `interface{}` yang merepotkan dan tidak aman secara tipe. Tapi sekarang, kita punya solusi yang elegan: **Generics**.

**Generics** adalah cara untuk menulis kode yang bisa bekerja dengan berbagai macam tipe data, tanpa harus mengorbankan keamanan tipe (_type safety_) yang menjadi ciri khas Go.

Di postingan 'pengetahuan tambahan' ini, kita akan mengupas tuntas Generics sesuai peta di atas. Mari kita tambahkan satu lagi 'jurus sakti' ke dalam koleksi kita!

## Fungsi Generik (Generic Functions)

Mari kita ubah dua fungsi `Sum` di atas menjadi satu fungsi generik. Sintaksnya menggunakan kurung siku `[]` setelah nama fungsi untuk mendeklarasikan _type parameter_.

```go
// T adalah 'type parameter' yang kita definisikan.
// Kita akan bahas soal 'Number' di bagian selanjutnya.
func Sum[T Number](numbers []T) T {
    var total T
    for _, n := range numbers {
        total += n
    }
    return total
}
```

Dengan satu fungsi ini, kita sekarang bisa memanggilnya untuk berbagai tipe angka. Keren, kan?

Bentuk paling dasar dari _type parameter_ adalah `any`, yang merupakan alias untuk `interface{}`. Ini berarti tipe tersebut bisa apa saja.

```go
// Fungsi ini bisa menerima nilai dengan tipe apa pun.
func Print[T any](value T) {
    fmt.Println(value)
}

func main() {
    Print("Hello")
    Print(123)
    Print(true)
}
```

## Batasan Tipe (Type Constraints)

Pada fungsi `Sum` kita, mengapa kita tidak bisa menggunakan `any`? Karena operator `+` tidak bisa digunakan untuk semua tipe data (misalnya, kita tidak bisa menjumlahkan `struct`).

Di sinilah **Type Constraint** berperan. _Constraint_ adalah sebuah _interface_ yang mendefinisikan "aturan main" untuk _type parameter_ kita. Aturan ini bisa berupa kumpulan tipe atau kumpulan _method_ yang harus dimiliki.

```go
// Kita definisikan sebuah constraint bernama 'Number'.
// Tipe T nantinya harus salah satu dari tipe-tipe ini.
type Number interface {
    int | int64 | float32 | float64
}

// Sekarang kita gunakan constraint 'Number' pada fungsi generik kita.
func Sum[T Number](numbers []T) T {
    var total T
    for _, n := range numbers {
        total += n
    }
    return total
}

func main() {
    fmt.Println("Jumlah int:", Sum([]int{1, 2, 3}))
    fmt.Println("Jumlah float:", Sum([]float64{1.1, 2.2, 3.3}))
    // Sum([]string{"a", "b"}) // Ini akan error saat kompilasi!
}
```

Dengan _constraint_, kita mendapatkan yang terbaik dari dua dunia: kode yang fleksibel dan tetap aman secara tipe. Go juga menyediakan _constraint_ bawaan seperti `comparable` untuk tipe-tipe yang bisa dibandingkan dengan `==` dan `!=`.

## Tipe dan Interface Generik (Generic Types / Interfaces)

Generics tidak hanya untuk fungsi. Kita juga bisa membuat `struct`, `interface`, atau tipe data lain yang generik. Ini sangat berguna untuk membuat struktur data seperti _stack_, _queue_, atau _linked list_.

Mari kita buat `struct` untuk _Stack_ (tumpukan) yang bisa menampung tipe data apa pun.

```go
// Mendefinisikan struct Stack yang generik.
// T bisa diganti dengan tipe apa pun saat struct ini dibuat.
type Stack[T any] struct {
    data []T
}

// Method Push untuk menambahkan data ke tumpukan.
func (s *Stack[T]) Push(value T) {
    s.data = append(s.data, value)
}

// Method Pop untuk mengambil data dari tumpukan.
func (s *Stack[T]) Pop() (T, bool) {
    if len(s.data) == 0 {
        var zero T // Kembalikan zero value dari tipe T
        return zero, false
    }
    lastIndex := len(s.data) - 1
    value := s.data[lastIndex]
    s.data = s.data[:lastIndex]
    return value, true
}

func main() {
    // Membuat stack untuk integer
    intStack := &Stack[int]{}
    intStack.Push(10)
    intStack.Push(20)
    val, _ := intStack.Pop()
    fmt.Println("Pop dari intStack:", val) // 20

    // Membuat stack untuk string
    stringStack := &Stack[string]{}
    stringStack.Push("hello")
    stringStack.Push("gopher")
    valStr, _ := stringStack.Pop()
    fmt.Println("Pop dari stringStack:", valStr) // gopher
}
```

## Inferensi Tipe (Type Inference)

Kalian mungkin sadar saat memanggil fungsi `Sum`, kita tidak perlu menulis `Sum[int](...)` atau `Sum[float64](...)`. Kita cukup menulis `Sum(...)`.

Ini karena Go memiliki **Type Inference**. Compiler Go cukup pintar untuk "menebak" atau menyimpulkan tipe apa yang seharusnya digunakan untuk `T` berdasarkan argumen yang kita berikan.

```go
// Kita tidak perlu menulis ini:
Sum[int]([]int{1, 2, 3})

// Cukup tulis ini, Go akan tahu T adalah int:
Sum([]int{1, 2, 3})
```

## Jurus Pamungkas Telah Dikuasai!

Kita baru saja menambahkan salah satu 'jurus' paling modern di Go ke dalam repertoar kita. Generics mungkin terlihat rumit pada awalnya, tetapi intinya sangat sederhana: menulis kode yang lebih sedikit namun tetap aman.

Singkatnya, kita sudah belajar:

- _Mengapa_ Generics dibutuhkan untuk menulis kode yang DRY (_Don't Repeat Yourself_).
- Cara membuat **fungsi** dan **tipe data** yang generik.
- Pentingnya **Type Constraints** untuk menjamin keamanan tipe.
- Kemudahan yang diberikan oleh **Type Inference**.

Generics adalah alat yang sangat kuat. Gunakan saat kalian benar-benar membutuhkannya untuk menghindari duplikasi kode.
