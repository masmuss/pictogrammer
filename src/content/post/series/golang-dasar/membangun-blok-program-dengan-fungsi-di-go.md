---
title: "Becoming Gopher #6 — Membangun Blok Program dengan Fungsi di Go"
description: "Fungsi adalah jantung dari program yang terstruktur. Mari kita deep dive dari dasar hingga konsep canggih seperti closure, recursive, dan function as a value."
date: 6 August 2025
tags: ["tech", "golang"]
---

Selamat datang kembali di seri **Becoming Gopher**! Di [episode sebelumnya](./jurus-sakti-mengelola-data-deep-dive-slice-dan-map), kita sudah menguasai cara mengelola data secara dinamis menggunakan `slice` dan `map`. Ransel petualangan kita sekarang penuh dengan 'alat' canggih untuk data.

Tapi, seiring program kita bertambah besar, kita akan sering menemukan diri kita menulis logika yang sama berulang-ulang di banyak tempat. Menyalin dan menempel kode (_copy-paste_) adalah resep jitu untuk bencana: tidak efisien, sulit dirawat, dan sangat rawan kesalahan.

Untuk mengatasi ini, kita perlu belajar cara membungkus logika kita ke dalam 'kapsul' atau 'blok bangunan' yang bisa digunakan kembali kapan pun kita butuhkan. Selamat datang di dunia `function`!

Postingan ini akan menjadi _deep dive_. Kita akan mulai dari dasar-dasar fungsi, lalu perlahan-lahan naik level ke konsep-konsep _powerful_ seperti _closure_ dan _recursive_. Anggap ini seperti belajar merakit berbagai macam mesin dari komponen-komponen dasar.

Siap untuk menjadi arsitek kodemu sendiri? Mari kita mulai membangun dengan `function`!

## Dasar-Dasar Fungsi

Fungsi adalah blok kode bernama yang melakukan tugas tertentu. Keindahan fungsi adalah kita bisa **menulisnya sekali dan memanggilnya berkali-kali**.

### Membuat dan Memanggil Fungsi

Bentuk paling sederhana dari sebuah fungsi adalah yang tidak menerima input dan tidak mengembalikan output. Kita sudah sering melihatnya: fungsi `main`.

```go
// Mendefinisikan fungsi bernama sayHello
func sayHello() {
	fmt.Println("Hello, Gopher!")
}

func main() {
	// Memanggil fungsi sayHello tiga kali
	sayHello()
	sayHello()
	sayHello()
}
```

### Memberi 'Input' dengan Parameter

Agar lebih berguna, fungsi harus bisa menerima data untuk diolah. Data yang dikirim ke dalam fungsi ini disebut **parameter**.

```go
// Fungsi ini menerima satu parameter bernama 'name' dengan tipe data string
func greet(name string) {
	fmt.Println("Halo,", name)
}

func main() {
	greet("Budi") // "Budi" adalah argumen yang dikirim ke parameter 'name'
	greet("Siti")
}
```

Jika ada beberapa parameter dengan tipe data yang sama, kita bisa menyingkat penulisannya.

```go
// Cara biasa
func sayHi(firstName string, lastName string) { /* ... */ }

// Cara singkat
func sayHi(firstName, lastName string) { /* ... */ }
```

### Mendapat 'Output' dengan Return Value

Selain menerima input, fungsi juga bisa memberikan hasil kembali. Nilai yang dikembalikan ini disebut **return value**. Tipe data dari nilai yang akan dikembalikan harus didefinisikan.

```go
func getGreeting(name string) string {
	greeting := "Hello, " + name
	return greeting
}

func main() {
	pesanSelamat := getGreeting("Rudi")
	fmt.Println(pesanSelamat) // Output: Hello, Rudi
}
```

## Fungsi Tingkat Lanjut

Sekarang kita sudah paham dasarnya, mari kita lihat fitur-fitur canggih yang membuat fungsi di Go sangat fleksibel.

### Mengembalikan Banyak Nilai

Ini adalah salah satu fitur khas Go. Sebuah fungsi bisa mengembalikan lebih dari satu nilai sekaligus. Ini sangat berguna, misalnya untuk mengembalikan hasil dan status error secara bersamaan.

```go
func getFullName() (string, string) {
	return "John", "Doe"
}

func main() {
	firstName, lastName := getFullName()
	fmt.Println(firstName, lastName) // John Doe
}
```

```go
func divide(a, b float64) (float64, error) {
    if b == 0 {
        return 0, fmt.Errorf("tidak bisa membagi dengan nol")
    }
    return a / b, nil
}

func main() {
    result, err := divide(10, 2)
    if err != nil {
        fmt.Println("Error:", err)
    } else {
        fmt.Println("Hasil:", result) // Hasil: 5
    }
}
```

Jika kita hanya butuh salah satu nilai, kita bisa menggunakan `_` (underscore) untuk mengabaikan nilai yang tidak kita perlukan.

```go
_, lastName := getFullName()
fmt.Println("Nama belakangnya adalah:", lastName)
```

### Pintasan dengan Named Return Values

Go mengizinkan kita untuk memberi nama pada variabel return value langsung di deklarasi fungsi. Ini bisa membuat kode lebih mudah dibaca dan kita bisa menggunakan `return` kosong.

```go
// 'name' dan 'age' adalah variabel yang sudah dideklarasikan
func getUserInfo() (name string, age int) {
	name = "Budi"
	age = 25
	return // Otomatis mengembalikan nilai dari variabel 'name' dan 'age'
}
```

### Parameter Tak Terbatas dengan Variadic Function

Bagaimana jika kita ingin membuat fungsi yang bisa menerima argumen sebanyak apa pun? Misalnya fungsi `sum` yang bisa menjumlahkan 2 angka, 5 angka, atau 100 angka. Inilah gunanya variadic parameter.

Gunakan `...` sebelum tipe data. Parameter ini harus diletakkan di posisi paling akhir dan di dalam fungsi akan diperlakukan sebagai sebuah `slice`.

```go
func sumAll(numbers ...int) int {
	total := 0
	for _, number := range numbers {
		total += number
	}
	return total
}

func main() {
	fmt.Println(sumAll(10, 20)) // 30
	fmt.Println(sumAll(5, 10, 15, 20)) // 50

	// Kita juga bisa mengirim slice, tapi harus dengan ...
	mySlice := []int{1, 2, 3}
	fmt.Println(sumAll(mySlice...)) // 6
}
```

## Fungsi Sebagai Warga Kelas Satu

Di Go, fungsi bukanlah 'warga kelas dua'. Ia diperlakukan setara dengan `int`, `string`, atau `bool`. Artinya, fungsi bisa disimpan di dalam variabel, dikirim sebagai parameter ke fungsi lain, bahkan dikembalikan sebagai hasil dari fungsi lain. Konsep ini disebut _first-class citizen_.

### Function as Value & Anonymous Function

Karena fungsi adalah nilai, kita bisa menyimpannya di dalam variabel. Seringkali, fungsi yang disimpan ini adalah **anonymous function** (fungsi tanpa nama).

```go
func main() {
	// Membuat fungsi tanpa nama dan menyimpannya di variabel 'kurang'
	kurang := func(a, b int) int {
		return a - b
	}

	hasil := kurang(10, 3)
	fmt.Println("Hasil:", hasil) // Hasil: 7
}
```

:::note
Gunakan anonymous function ketika:

- Fungsi tersebut hanya akan digunakan sekali di tempat itu.
- Kalian tidak mau repot-repot membuat nama untuk fungsi yang sederhana.
- Ingin menulis fungsi secara _inline_ (misalnya sebagai argumen).
  :::

### Function as Parameter (Callback)

Ini adalah pola yang sangat kuat. Kita bisa mengirim sebuah fungsi sebagai argumen ke fungsi lain. Fungsi yang dikirim ini sering disebut _callback_.

```go
// 'filter' adalah fungsi yang akan dikirim sebagai parameter
func filterNama(names []string, filter func(string) bool) []string {
	var result []string
	for _, name := range names {
		if filter(name) {
			result = append(result, name)
		}
	}
	return result
}

func main() {
	dataNama := []string{"Budi", "Siti", "Joko", "Susan"}

	// filter untuk nama yang mengandung huruf 'u'
	namaDenganU := filterNama(dataNama, func(name string) bool {
		return strings.Contains(name, "u")
	})

	fmt.Println(namaDenganU) // [Budi Susan]
}
```

Untuk membuat kode lebih rapi, kita bisa membuat _alias_ untuk tipe fungsi menggunakan `type`.

```go
type FilterFunc func(string) bool

func filterNama(names []string, filter FilterFunc) []string {
    // ... implementasi sama ...
}
```

## Pola Fungsi Lanjutan

Mari kita tutup dengan dua konsep yang mungkin sedikit membengkokkan pikiran, tetapi sangat powerful.

### Recursive Function - Fungsi yang Memanggil Dirinya Sendiri

Fungsi rekursif adalah fungsi yang memanggil dirinya sendiri di dalam badannya. Ini sangat berguna untuk memecahkan masalah yang bisa dipecah menjadi sub-masalah yang lebih kecil dan identik, seperti menghitung faktorial.

```
5=5
times4
times3
times2
times1
```

```go
// Versi rekursif untuk menghitung faktorial
func factorial(value int) int {
    // Base Case: Kondisi berhenti agar tidak terjadi perulangan tak terbatas
	if value == 1 {
		return 1
	} else {
        // Recursive Step: Memanggil diri sendiri dengan masalah yang lebih kecil
		return value * factorial(value-1)
	}
}
```

:::warning
**Penting: Harus Ada "Base Case"**
Setiap fungsi rekursif wajib memiliki _base case_, yaitu kondisi di mana ia berhenti memanggil dirinya sendiri. Tanpa itu, program akan mengalami _infinite recursion_ dan _crash_!
:::

### Closure - Fungsi yang Punya Ingatan

Closure adalah sebuah fungsi yang "mengingat" variabel-variabel dari lingkungan tempat ia diciptakan, bahkan setelah lingkungan tersebut sudah tidak ada.

Lihat contoh ini. Fungsi `increment` adalah sebuah _closure_ karena ia mengakses dan memodifikasi variabel `counter` yang ada di luar lingkupnya.

```go
func main() {
	counter := 0

	increment := func() {
		counter++
		fmt.Println("Nilai counter sekarang:", counter)
	}

	increment() // Nilai counter sekarang: 1
	increment() // Nilai counter sekarang: 2

    // Meskipun 'increment' dipanggil berulang kali, ia tetap "ingat"
    // nilai terakhir dari 'counter'.
}
```

Konsep ini menjadi lebih kuat ketika sebuah fungsi mengembalikan fungsi lain.

```go
// newCounter adalah fungsi yang mengembalikan sebuah fungsi (closure)
func newCounter() func() int {
	counter := 0
	return func() int {
		counter++
		return counter
	}
}

func main() {
	// 'counterA' adalah sebuah closure dengan 'counter'-nya sendiri
	counterA := newCounter()
	fmt.Println("A:", counterA()) // A: 1
	fmt.Println("A:", counterA()) // A: 2

	// 'counterB' adalah closure lain dengan 'counter' yang terpisah
	counterB := newCounter()
	fmt.Println("B:", counterB()) // B: 1
}
```

Setiap kali `newCounter()` dipanggil, ia menciptakan sebuah lingkungan baru dengan variabel `counter`-nya sendiri. Fungsi closure yang dikembalikan akan selalu terikat pada lingkungan tersebut.

## Petualangan Hari Ini Selesai!

Phew, itu tadi perjalanan yang panjang dan mendalam! Jika kamu berhasil sampai sini, selamat! Kamu baru saja menguasai salah satu pilar terpenting dalam pemrograman Go: **fungsi**.

Kita sudah menjelajahi semuanya, mulai dari:

- Dasar-dasar membuat fungsi dengan parameter dan _return value_.
- Fitur-fitur keren seperti _multiple return_ dan _variadic function_.
- Konsep canggih di mana fungsi diperlakukan sebagai nilai.
- Pola-pola kuat seperti _recursive_ dan _closure_.

Setelah kita bisa mengorganisir logika kita dengan rapi, langkah selanjutnya adalah mengorganisir _data_ dan _perilakunya_ dengan cara yang lebih canggih. Di petualangan berikutnya, kita akan belajar membuat tipe data kita sendiri menggunakan `struct` dan mendefinisikan perilakunya dengan `method`.

<!-- Topik fungsi mana yang menurutmu paling menarik? Atau paling membingungkan? Bagikan pikiranmu di kolom komentar! -->
