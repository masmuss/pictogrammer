---
title: "Becoming Gopher #7 — Membuat Tipe Data Sendiri: Struct, Method, dan Interface"
description: "Naik level dari pengguna menjadi pencipta! Pelajari cara merancang blueprint data dengan Struct, memberinya perilaku dengan Method, dan membuat kontrak dengan Interface."
date: 7 August 2025
tags: ["tech", "golang"]
---

Selamat datang kembali di petualangan **Becoming Gopher**! Di [bab sebelumnya](./membangun-blok-program-dengan-fungsi-di-go), kita sudah menjadi arsitek program dengan merakit logika kita ke dalam `function` yang rapi dan bisa digunakan kembali.

Sejauh ini, kita hanya bekerja dengan tipe data dasar seperti `string`, `int`, dan `bool`. Tapi, dunia nyata jauh lebih kompleks. Bagaimana cara kita merepresentasikan 'Pengguna', 'Produk', atau 'Buku' yang memiliki banyak atribut (nama, harga, stok, dll.) dalam satu kesatuan?

Di sinilah kita naik level dari sekadar 'programmer' menjadi 'desainer sistem'. Hari ini kita akan belajar tiga konsep yang saling terkait untuk menciptakan tipe data kita sendiri:

1.  **`Struct`**: Kita akan belajar membuat 'cetakan' atau 'blueprint' data kita sendiri.
2.  **`Method`**: Lalu, kita akan memberikan 'kemampuan' atau 'perilaku' pada data kita dengan menempelkan fungsi langsung padanya.
3.  **`Interface`**: Terakhir, kita akan belajar mendefinisikan 'kontrak' atau 'aturan main' yang bisa diikuti oleh tipe data apa pun.

Ini adalah fondasi dari _Object-Oriented Programming_ (OOP) ala Go. Siap untuk mulai merancang duniamu sendiri di dalam kode? Ayo kita mulai!

## `Struct`: Cetakan untuk Datamu

**Struct** (struktur) adalah sebuah _template_ data yang digunakan untuk menggabungkan beberapa tipe data berbeda menjadi satu kesatuan yang logis. Anggap saja `struct` adalah cara kita membuat tipe data baru yang lebih kompleks.

Misalnya, kita ingin merepresentasikan sebuah buku. Sebuah buku memiliki judul (`string`), penulis (`string`), tahun terbit (`int`), dan status ketersediaan (`bool`). Dengan `struct`, kita bisa membungkus semua informasi itu.

### Membuat dan Menggunakan Struct

Pertama, kita definisikan 'cetakan'-nya menggunakan `type` dan `struct`.

```go
// Mendefinisikan blueprint untuk sebuah Buku
type Book struct {
	Title     string
	Author    string
	Year      int
	Available bool
}
```

Sekarang kita punya tipe data baru bernama `Book`. Mari kita buat sebuah variabel dengan tipe tersebut.

```go
func main() {
	// Membuat data buku berdasarkan blueprint 'Book'
	buku1 := Book{
		Title:     "Go untuk Pemula",
		Author:    "Khoirul Anwar",
		Year:      2025,
		Available: true,
	}

	// Mengakses data di dalamnya menggunakan notasi titik (.)
	fmt.Println("Judul:", buku1.Title)
	fmt.Println("Penulis:", buku1.Author)

	// Kita juga bisa mengubah nilainya
	buku1.Available = false
	fmt.Println("Status sekarang:", buku1.Available)
}
```

#### Praktik Terbaik: Fungsi Konstruktor

Meskipun kita bisa membuat `struct` secara langsung seperti di atas, praktik yang umum di Go adalah menggunakan fungsi konstruktor. Ini adalah sebuah fungsi konvensional yang bertujuan untuk membuat instance dari `struct` dengan cara yang terpusat dan valid.

```go
// Fungsi yang 'merakit' dan mengembalikan sebuah Book baru
func NewBook(title string, author string, year int) *Book {
	return &Book{
		Title:     title,
		Author:    author,
		Year:      year,
		Available: true, // Bisa atur nilai default di sini
	}
}

func main() {
    // Penggunaan konstruktor
	bukuBaru := NewBook("Go untuk Pemula", "Khoirul Anwar", 2025)
	fmt.Println("Judul dari konstruktor:", bukuBaru.Title)
}
```

Pola ini sangat berguna untuk menjaga konsistensi saat membuat objek yang kompleks.

#### Sekilas Info: `Struct Tags`

Sebelum lanjut, ada satu fitur keren dari `struct` yang akan sangat berguna saat kamu membuat aplikasi web, yaitu _struct tags_. Ini adalah anotasi metadata yang kita berikan pada _field_ untuk memberi instruksi pada package lain, misalnya saat mengubah `struct` menjadi JSON.

```go
import "encoding/json"

type Product struct {
	Name      string `json:"name"` // Saat diubah ke JSON, field ini akan bernama "name"
	Price     int    `json:"price"`
	IsReady   bool   `json:"is_ready,omitempty"` // "omitempty" berarti field ini akan diabaikan jika nilainya kosong
	SecretKey string `json:"-"` // Tanda "-" berarti field ini akan selalu diabaikan
}
```

Tidak perlu pusing sekarang, cukup tahu bahwa fitur ini ada dan sangat powerful.

### `Method`: Memberi Kemampuan pada Struct

Data tanpa perilaku itu pasif. Kita bisa memberi 'kemampuan' atau 'perilaku' pada `struct` kita dengan menempelkan fungsi langsung padanya. Fungsi yang 'terikat' pada sebuah `struct` inilah yang disebut **method**.

Perbedaannya sederhana:

- **Fungsi biasa**: `lakukanSesuatu(data)`
- **Method**: `data.lakukanSesuatu()`

Mari kita berikan `method` pada `struct Book` kita untuk menampilkan informasinya sendiri.

```go
type Book struct {
	Title     string
	Author    string
	Available bool
}

// Ini adalah METHOD karena terikat pada (b Book)
// 'b' disebut sebagai receiver
func (b Book) PrintInfo() {
	fmt.Println("--- Informasi Buku ---")
	fmt.Println("Judul:", b.Title)
	fmt.Println("Penulis:", b.Author)
	if b.Available {
		fmt.Println("Status: Tersedia")
	} else {
		fmt.Println("Status: Tidak tersedia")
	}
}

func main() {
	book := Book{Title: "Go untuk Pemula", Author: "Khoirul Anwar", Available: true}

    // Memanggil method langsung dari variabel struct
	book.PrintInfo()
}
```

Dengan `method`, `struct` kita kini tidak hanya menyimpan data, tapi juga tahu bagaimana cara memproses datanya sendiri.

## `Interface`: Kontrak Perilaku Universal

Konsep ini sedikit abstrak, tapi sangat kuat. Bayangkan sebuah stopkontak di dinding. Stopkontak itu tidak peduli apa yang akan kalian colok: charger HP, adaptor laptop, atau kipas angin. Ia hanya punya satu aturan atau **kontrak**: "Jika kamu punya dua pin logam yang sesuai, kamu bisa terhubung denganku."

**Interface** di Go adalah persis seperti itu: sebuah kontrak perilaku. Ia hanya mendefinisikan sekumpulan _method_ yang _harus dimiliki_, tanpa peduli siapa yang memilikinya.

```go
// Siapapun yang punya method PrintInfo(), dia adalah seorang 'Printable'
type Printable interface {
    PrintInfo()
}
```

### Implementasi Interface yang Ajaib

Inilah keunikan Go. Sebuah `struct` tidak perlu secara eksplisit bilang, "Hei, saya mengimplementasikan interface Printable!". Cukup dengan **memiliki semua method yang disyaratkan oleh interface tersebut**, maka Go secara otomatis menganggapnya patuh pada kontrak. Ini disebut _implicit interface implementation_.

Mari kita lihat contohnya. Kita punya `Book` dan `Magazine`.

```go
// Interface (Kontrak)
type Printable interface {
    PrintInfo()
}

// Struct pertama
type Book struct {
    Title  string
    Author string
}

// Book punya method PrintInfo(), jadi ia adalah Printable
func (b Book) PrintInfo() {
    fmt.Println("Buku:", b.Title, "oleh", b.Author)
}

// Struct kedua
type Magazine struct {
    Title string
    Issue int
}

// Magazine juga punya PrintInfo(), jadi ia juga Printable
func (m Magazine) PrintInfo() {
    fmt.Println("Majalah:", m.Title, "Edisi ke", m.Issue)
}

// Fungsi ini menerima TIPE APAPUN yang memenuhi kontrak Printable
func displayItem(p Printable) {
    p.PrintInfo()
}

func main() {
    buku := Book{Title: "Go untuk Pemula", Author: "Khoirul Anwar"}
    majalah := Magazine{Title: "Tech Today", Issue: 42}

    displayItem(buku)    // Bisa, karena buku adalah Printable
    displayItem(majalah) // Bisa juga, karena majalah juga Printable
}
```

Fungsi `displayItem` tidak perlu tahu detail tentang `Book` atau `Magazine`. Ia hanya peduli satu hal: "Apakah benda ini bisa di-`PrintInfo()`?". Fleksibilitas inilah yang membuat interface menjadi pilar utama dalam membangun software yang modular di Go.

### Menggabungkan Interface (Embedding Interfaces)

Kita bisa membangun interface yang lebih kompleks dengan menyatukan beberapa interface yang lebih kecil. Ini disebut **embedding**. Praktik ini sangat dianjurkan di Go karena mendorong kita untuk membuat interface kecil yang bisa digunakan kembali.

Bayangkan kita butuh sesuatu yang bisa membaca dan menulis data.

```go
type Reader interface {
    Read(p []byte) (n int, err error)
}

type Writer interface {
    Write(p []byte) (n int, err error)
}

// ReadWriter adalah interface yang menggabungkan Reader dan Writer.
// Tipe apa pun yang ingin dianggap ReadWriter HARUS memiliki method Read() DAN Write().
type ReadWriter interface {
    Reader
    Writer
}

// Contoh implementasi
type File struct {
    // ... field internal
}

func (f *File) Read(p []byte) (n int, err error) {
    // ... logika membaca file
    return 0, nil
}

func (f *File) Write(p []byte) (n int, err error) {
    // ... logika menulis file
    return 0, nil
}

func main() {
    var file ReadWriter = &File{}
    // Variabel 'file' sekarang bisa dioperasikan sebagai Reader sekaligus Writer.
    fmt.Println(file)
}
```

### `interface{}` - Si Super Fleksibel

Ada satu interface spesial: `interface{}`. Karena ia tidak mensyaratkan _method_ apa pun (kontraknya kosong), maka **semua tipe data** di Go secara otomatis memenuhinya. `interface{}` bisa menampung nilai apa saja, menjadikannya tipe data paling fleksibel di Go.

```go
func printAnything(data interface{}) {
	fmt.Println("Data yang diterima:", data)
}

printAnything(123)
printAnything("hello")
printAnything(Book{Title: "Go", Author: "X"})
```

## Petualangan Hari Ini Selesai!

Kita baru saja menyelesaikan salah satu bab paling konseptual dalam perjalanan "Becoming Gopher". Kita tidak lagi hanya menggunakan tipe data bawaan, tapi sudah bisa **menciptakan tipe data kita sendiri** yang merepresentasikan dunia nyata.

Singkatnya, hari ini kita sudah belajar:

- Membungkus kumpulan data terkait ke dalam sebuah 'cetakan' bernama `struct`.
- Memberikan 'kemampuan' atau perilaku pada `struct` dengan `method`.
- Mendefinisikan 'kontrak' perilaku universal yang membuat kode kita fleksibel dengan `interface`.

Kita sudah bisa merancang data dan perilakunya. Tapi, ada satu topik fundamental yang sengaja kita simpan sampai sekarang karena butuh pemahaman yang matang: `pointer`. Di episode selanjutnya, kita akan membongkar misteri _pointer_ dan melihat bagaimana ia bisa membuat program kita jauh lebih efisien.

Coba pikirkan, objek apa dari dunia nyata yang bisa kamu modelkan dengan `struct` dan `interface`?
