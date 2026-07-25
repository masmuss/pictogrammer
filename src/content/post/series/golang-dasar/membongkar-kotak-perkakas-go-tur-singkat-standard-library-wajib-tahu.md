---
title: "Becoming Gopher #12 — Membongkar Kotak Perkakas Go: Tur Singkat Standard Library Wajib Tahu"
description: "Go hadir dengan 'kotak perkakas' super lengkap. Mari kita jelajahi beberapa paket standard library paling berguna yang akan sering Kalian gunakan, dari `fmt` hingga `net/http`."
date: 14 August 2025
tags: ["tech", "golang"]
---

Selamat datang kembali di petualangan **Becoming Gopher**! Sejauh ini, kita telah mempelajari bahasa Go dari dasar hingga konsep-konsep canggih. Sekarang, saatnya kita melihat salah satu kekuatan terbesar Go yang membuatnya begitu produktif.

Bayangkan kamu membeli sebuah kotak perkakas super canggih. Saat dibuka, ternyata isinya bukan hanya palu dan obeng, tapi juga gergaji mesin, bor listrik, dan bahkan alat las! Itulah rasanya menggunakan Go.

Perkakas-perkakas bawaan ini di dunia pemrograman disebut **Standard Library (stdlib)**. Go terkenal memiliki salah satu `stdlib` yang paling kaya, kuat, dan siap untuk level produksi.

Di postingan ini, kita tidak akan membahas semua paket (karena jumlahnya ratusan!), tapi kita akan melakukan tur singkat ke beberapa paket paling berguna yang akan sering kamu temui dan gunakan dalam proyek-proyekmu.

Mari kita buka 'kotak perkakas' kita dan lihat apa saja isinya!

## Paket `fmt` - Sang Juru Cetak

Kita sudah sangat akrab dengan paket ini, terutama fungsi `fmt.Println()`. Tapi `fmt` jauh lebih dari itu. Ini adalah paket andalan untuk semua kebutuhan format I/O (_Input/Output_).

- **`Printf`**: Mencetak string dengan format tertentu menggunakan "kata kerja" format.
- **`Sprintf`**: Sama seperti `Printf`, tapi hasilnya dikembalikan sebagai `string`, bukan dicetak ke konsol.

```go
nama := "Gopher"
umur := 10

// %s untuk string, %d untuk angka desimal (integer)
fmt.Printf("Halo, namaku %s dan umurku %d tahun.\n", nama, umur)

// %v adalah kata kerja universal, akan menampilkan nilai dalam format default
fmt.Printf("Data: %v, Tipe Data: %T\n", nama, nama)

// Menyimpan hasil format ke dalam variabel
kalimat := fmt.Sprintf("Selamat datang, %s!", nama)
fmt.Println(kalimat)
```

## Paket `strings` - Ahli Manipulasi Teks

Setiap aplikasi pasti berurusan dengan teks. Paket `strings` menyediakan semua 'jurus' yang Kalian butuhkan untuk memanipulasi `string`.

- `Contains`: Memeriksa apakah sebuah string mengandung substring tertentu.
- `Split`: Memecah string menjadi _slice_ berdasarkan pemisah (_separator_).
- `Join`: Menggabungkan _slice_ string menjadi satu string dengan pemisah.
- `ReplaceAll`: Mengganti semua kemunculan substring dengan yang baru.
- `ToLower` / `ToUpper`: Mengubah huruf menjadi kecil atau besar.

```go
kalimat := "Go itu cepat, Go itu simpel"

fmt.Println("Mengandung 'cepat'?:", strings.Contains(kalimat, "cepat")) // true

potongan := strings.Split(kalimat, ", ")
fmt.Printf("Hasil Split: %v\n", potongan) // [Go itu cepat Go itu simpel]

digabung := strings.Join([]string{"satu", "dua", "tiga"}, "-")
fmt.Println("Hasil Join:", digabung) // satu-dua-tiga

diganti := strings.ReplaceAll(kalimat, "Go", "Golang")
fmt.Println("Hasil Replace:", diganti) // Golang itu cepat, Golang itu simpel
```

## Paket `strconv` - Jembatan Antar Tipe Data

`strconv` (_string conversion_) adalah jembatan penting antara `string` dengan tipe data lain seperti `int` atau `bool`.

- `Atoi`: (_ASCII to Integer_) Mengubah `string` menjadi `int`.
- `Itoa`: (_Integer to ASCII_) Mengubah `int` menjadi `string`.
- `ParseBool`: Mengubah `string` seperti `"true"` atau `"false"` menjadi `bool`.

```go
angkaString := "123"
angkaInt, err := strconv.Atoi(angkaString)
if err != nil {
    fmt.Println("Gagal konversi:", err)
} else {
    fmt.Println("Hasil Atoi:", angkaInt * 2) // 246
}

nomor := 456
nomorString := strconv.Itoa(nomor)
fmt.Println("Hasil Itoa: " + nomorString) // "456"
```

## Paket `os` - Gerbang Menuju Sistem Operasi

Paket `os` memberikan Kalian akses untuk berinteraksi dengan fungsionalitas sistem operasi, seperti membaca argumen _command-line_ dan bekerja dengan file.

- `os.Args`: Sebuah _slice_ `string` yang berisi argumen yang diberikan saat program dijalankan. `os.Args[0]` selalu nama program itu sendiri.
- `os.ReadFile`: Membaca seluruh isi file dan mengembalikannya sebagai `[]byte`.
- `os.WriteFile`: Menulis `[]byte` ke dalam sebuah file.

```go title="main.go"
// jalankan dengan: go run main.go Halo Gopher
package main

import (
	"fmt"
	"os"
)

func main() {
    // Membaca argumen command-line
	args := os.Args
	fmt.Println("Semua argumen:", args)
	fmt.Println("Argumen pertama:", args[1]) // Halo

	// Menulis dan Membaca file
	data := []byte("Ini adalah data file.")
	err := os.WriteFile("contoh.txt", data, 0644)
	if err != nil {
		panic(err)
	}

	isiFile, err := os.ReadFile("contoh.txt")
	if err != nil {
		panic(err)
	}
	fmt.Println("Isi file:", string(isiFile))
}
```

## Paket `encoding/json` - Penerjemah Data Modern

Hampir semua API modern menggunakan format JSON. Paket ini adalah alat super ampuh untuk mengubah data `struct` Go menjadi JSON (_Marshal_) dan sebaliknya (_Unmarshal_).

```go
type User struct {
    ID   int    `json:"id"`
    Name string `json:"name"`
    // `json:"-"` berarti field ini akan diabaikan
    Password string `json:"-"`
}

func main() {
    // 1. Marshal (Go Struct -> JSON)
    user := User{ID: 1, Name: "Budi", Password: "rahasia"}
    jsonData, err := json.Marshal(user)
    if err != nil {
        panic(err)
    }
    fmt.Println("JSON:", string(jsonData)) // {"id":1,"name":"Budi"}

    // 2. Unmarshal (JSON -> Go Struct)
    jsonString := `{"id":2,"name":"Siti"}`
    var user2 User
    err = json.Unmarshal([]byte(jsonString), &user2)
    if err != nil {
        panic(err)
    }
    fmt.Printf("User 2: %+v\n", user2) // {ID:2 Name:Siti Password:}
}
```

## Paket `time` - Sang Penguasa Waktu

Semua kebutuhan terkait waktu ada di sini, mulai dari mendapatkan waktu saat ini hingga mengukur durasi.

- `time.Now()`: Mendapatkan waktu saat ini.
- `.Format()`: Memformat waktu. **Penting**: Go menggunakan layout unik `2006-01-02 15:04:05` sebagai referensi.
- `time.Sleep()`: Menjeda eksekusi program.

```go
sekarang := time.Now()
fmt.Println("Waktu saat ini:", sekarang)

// Format waktu sesuai standar RFC3339
fmt.Println(sekarang.Format(time.RFC3339))
// Format custom
fmt.Println(sekarang.Format("2 January 2006"))

// Jeda program selama 1 detik
time.Sleep(1 * time.Second)
fmt.Println("Setelah 1 detik")
```

## Paket `io` - Aliran Data Universal

Paket `io` menyediakan abstraksi I/O yang fundamental, terutama interface `io.Reader` dan `io.Writer`.

- `io.Reader`: Merepresentasikan sesuatu yang bisa dibaca (seperti file, _request body_ HTTP, atau string).
- `io.Writer`: Merepresentasikan sesuatu yang bisa ditulis (seperti file, _response writer_ HTTP, atau konsol).
- `io.Copy`: Menyalin data dari `Reader` ke `Writer`.

```go
// Membuat Reader dari sebuah string
pembaca := strings.NewReader("Halo Gopher dari io.Reader!\n")

// os.Stdout (konsol) adalah sebuah Writer
_, err := io.Copy(os.Stdout, pembaca)
if err != nil {
    log.Fatal(err)
}
```

## Paket `log` - Pencatat Pesan Sederhana

Untuk _logging_ yang sederhana tanpa perlu dependensi eksternal, paket `log` sudah lebih dari cukup. Secara _default_, ia akan mencetak pesan ke konsol lengkap dengan tanggal dan waktu.

- `log.Println`: Mencetak pesan log standar.
- `log.Printf`: Mencetak pesan log dengan format.
- `log.Fatal`: Sama seperti `Println`, tapi akan menghentikan program setelah mencetak.

```go
log.Println("Ini adalah pesan informasi.")
log.Printf("Program sedang memproses %d item.", 10)

// Contoh penggunaan Fatal
_, err := os.Open("file-tidak-ada.txt")
if err != nil {
    log.Fatal("Error fatal:", err) // Akan mencetak pesan dan program berhenti
}
```

## Paket `net/http` - Membangun Web Server dalam Sekejap

Ini adalah salah satu fitur paling "ajaib" dari Go. Kalian bisa membuat server web yang berfungsi penuh hanya dengan beberapa baris kode, tanpa perlu _framework_ eksternal.

```go
package main

import (
	"fmt"
	"net/http"
)

func main() {
    // Menentukan bahwa setiap request ke "/" akan ditangani oleh fungsi 'handler'
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintln(w, "Halo, Gopher! Anda telah mengakses halaman utama.")
	})

    // Menentukan handler untuk path lain
	http.HandleFunc("/about", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintln(w, "Ini adalah halaman tentang kami.")
	})

    fmt.Println("Server berjalan di http://localhost:8080")
    // Menjalankan server di port 8080
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		panic(err)
	}
}
```

## Kotak Perkakas yang Selalu Siap

Kita baru saja melihat betapa banyaknya 'perkakas' canggih yang sudah tersedia langsung saat kita menginstal Go.

Kekuatan `stdlib` Go berarti untuk banyak tugas umum kita tidak perlu langsung mencari library pihak ketiga. Solusinya seringkali sudah ada di dalam 'kotak perkakas' kita.

Tur ini hanya menyentuh permukaannya. Saya sangat mendorongmu untuk menjelajahi dokumentasi resmi di [pkg.go.dev](http://pkg.go.dev) dan menemukan paket-paket lain yang sesuai dengan kebutuhanmu.
