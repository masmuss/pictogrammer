---
title: "Becoming Gopher #11 — Kamu Siap! Proyek Pertama dan Arah Selanjutnya di Dunia Go"
description: "Babak final dari seri Becoming Gopher! Mari rangkai semua yang telah kita pelajari untuk membangun aplikasi To-Do List dan lihat sekilas kekuatan super Go: Konkurensi."
date: 11 August 2025
tags: ["tech", "golang"]
---

Selamat datang di babak **final** dari seri petualangan **Becoming Gopher**! Kita sudah menempuh perjalanan yang panjang bersama. Mulai dari [menyiapkan 'arena'](./from-zero-menyiapkan-arena-ngoding-go), belajar menyimpan data, memberi 'otak' pada program, merakit `function`, mendesain `struct`, hingga menaklukkan `pointer` dan [menangani `error`](./menjadi-profesional-mengorganisir-kode-and-menangani-error).

Ransel kita sudah penuh dengan berbagai 'alat' dan 'jurus sakti'. Sekarang, saatnya kita menggunakan semuanya. Hari ini tidak ada teori baru yang rumit. Sebaliknya, kita akan melakukan dua hal:

1.  **Membangun Sesuatu:** Kita akan merangkai semua yang telah kita pelajari untuk membangun proyek pertama kita: sebuah aplikasi To-Do List sederhana di terminal.
2.  **Melihat ke Horison:** Setelah proyek selesai, kita akan melihat sekilas ke 'dunia setelah ini', yaitu kekuatan super Go yang membuatnya begitu istimewa: Konkurensi.

Ini adalah momen pembuktian. Mari kita gabungkan semua kepingan puzzle yang telah kita kumpulkan dan ciptakan sesuatu yang nyata. Siap untuk _build_ terakhir kita di seri ini?

## Proyek Pertama Kita: Aplikasi To-Do List di Terminal (CLI)

Proyek terbaik untuk memulai adalah yang tidak memerlukan antarmuka visual (UI) yang rumit, sehingga kita bisa fokus pada logika inti. Karena itu, kita akan membuat aplikasi _Command-Line Interface_ (CLI).

### Blueprint Proyek

Kita akan membangun aplikasi ini langkah demi langkah, menggunakan konsep yang sudah kita pelajari di bab-bab sebelumnya.

#### Langkah 1: `struct` - Cetak Biru untuk 'Todo' Kita

Pertama, kita butuh 'cetakan' untuk setiap tugas. Sebuah tugas memiliki ID, deskripsi pekerjaan, dan status selesai.

```go
// main.go
package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"
)

type Todo struct {
	ID          int
	Task        string
	IsCompleted bool
}
```

#### Langkah 2: `slice` - Wadah untuk Semua 'Todo'

Kita butuh tempat untuk menyimpan semua tugas kita. `slice` adalah pilihan yang sempurna karena jumlah tugas kita bisa bertambah. Kita juga butuh variabel untuk melacak ID berikutnya.

```go
// ... setelah struct Todo

// "Database" sederhana kita
var todos []Todo
var nextID int = 1
```

#### Langkah 3: `function` - Memecah Logika Menjadi Bagian Kecil

Sekarang, mari kita buat fungsi untuk setiap aksi yang bisa dilakukan pengguna.

Fungsi untuk Menambah Tugas:

```go
func addTodo(task string) {
	newTodo := Todo{
		ID:          nextID,
		Task:        task,
		IsCompleted: false,
	}
	todos = append(todos, newTodo)
	nextID++
	fmt.Println("Tugas baru ditambahkan!")
}
```

Fungsi untuk Menampilkan Semua Tugas:

```go
func viewTodos() {
	if len(todos) == 0 {
		fmt.Println("Belum ada tugas. Saatnya bersantai!")
		return
	}

	fmt.Println("--- Daftar Tugas ---")
	for _, todo := range todos {
		status := " "
		if todo.IsCompleted {
			status = "x"
		}
		fmt.Printf("[%s] %d: %s\n", status, todo.ID, todo.Task)
	}
}
```

Fungsi untuk Menandai Tugas Selesai:

```go
func completeTodo(id int) {
	for i := range todos {
		if todos[i].ID == id {
			todos[i].IsCompleted = true
			fmt.Printf("Tugas #%d ditandai selesai.\n", id)
			return
		}
	}
	fmt.Printf("Error: Tugas dengan ID %d tidak ditemukan.\n", id)
}
```

#### Langkah 4: `main` - Menyatukan Semuanya (The Main Loop)

Inilah inti dari aplikasi kita. Kita akan membuat perulangan tak terbatas yang akan terus menampilkan menu, menunggu input pengguna, dan memanggil fungsi yang sesuai menggunakan `switch`.

```go
func main() {
	reader := bufio.NewReader(os.Stdin)

	for {
		fmt.Println("\n--- Aplikasi To-Do ---")
		fmt.Println("1. Lihat Tugas")
		fmt.Println("2. Tambah Tugas")
		fmt.Println("3. Tandai Selesai")
		fmt.Println("4. Keluar")
		fmt.Print("Pilih Opsi: ")

		input, _ := reader.ReadString('\n')
		choice := strings.TrimSpace(input)

		switch choice {
		case "1":
			viewTodos()
		case "2":
			fmt.Print("Masukkan deskripsi tugas: ")
			task, _ := reader.ReadString('\n')
			addTodo(strings.TrimSpace(task))
		case "3":
			fmt.Print("Masukkan ID tugas yang selesai: ")
			idStr, _ := reader.ReadString('\n')
			id, err := strconv.Atoi(strings.TrimSpace(idStr))
			if err != nil {
				fmt.Println("Error: Input harus berupa angka.")
			} else {
				completeTodo(id)
			}
		case "4":
			fmt.Println("Terima kasih! Sampai jumpa.")
			return // Keluar dari program
		default:
			fmt.Println("Pilihan tidak valid.")
		}
	}
}
```

**Jalankan Programnya!**
Simpan semua kode di atas dalam satu file `main.go`, lalu jalankan dengan `go run main.go`. Selamat, Kamu telah membangun aplikasi pertamamu!

## Level Up: Versi Proyek dengan Pointer dan Error Handling

Proyek di atas adalah awal yang sangat baik dan fungsional! Namun, seiring kita menjadi Gopher yang lebih profesional, ada beberapa hal yang bisa kita tingkatkan agar kode kita lebih tangguh, efisien, dan sesuai dengan praktik terbaik di Go.

Saya telah membuat versi yang lebih canggih dari aplikasi ini yang menerapkan konsep `pointer` dan `error handling` secara lebih mendalam, seperti yang telah kita bahas di bab-bab sebelumnya.

Beberapa peningkatan utama dalam versi baru ini adalah:

- **Penggunaan Pointer pada Fungsi:** Perhatikan bagaimana fungsi seperti `addTodo` kini menerima `*[]Todo` (pointer ke slice) dan `*int` (pointer ke int). Ini adalah cara yang lebih idiomatis untuk secara eksplisit menunjukkan bahwa sebuah fungsi akan memodifikasi data asli yang dikirimkan kepadanya.
- **Error Handling Eksplisit:** Setiap fungsi kini mengembalikan nilai `error`. Ini adalah cara standar Go untuk memberi sinyal jika terjadi kesalahan. Di dalam fungsi `main`, kita sekarang selalu memeriksa `if err != nil` setelah setiap pemanggilan fungsi. Ini membuat program kita lebih tangguh karena tidak mengabaikan potensi masalah.
- **Penggunaan `panic` dan `recover` yang Terkendali:** Untuk kasus-kasus yang seharusnya tidak terjadi (seperti mencoba menyelesaikan tugas dengan ID yang tidak ada), versi ini menggunakan `panic`. Namun, `panic` tersebut langsung ditangkap dengan `defer` dan `recover`, lalu diubah menjadi nilai `error` yang rapi. Ini adalah pola lanjutan yang menunjukkan bagaimana `panic` bisa digunakan untuk mengontrol alur dalam kasus-kasus ekstrem tanpa membuat program _crash_.
- **Manajemen Variabel yang Lebih Baik:** Alih-alih menggunakan variabel global, `todos` dan `nextID` sekarang dimiliki oleh fungsi `main` dan dikirimkan sebagai pointer ke fungsi lain yang membutuhkannya. Ini adalah praktik yang lebih baik karena membuat alur data lebih jelas dan mengurangi _side effects_.

Mempelajari dan membandingkan kedua versi kode ini adalah latihan yang sangat bagus untuk memahami evolusi dari kode pemula menjadi kode yang lebih matang dan idiomatis.

📂 **Lihat Kode Lengkap di GitHub:**
Kalian bisa melihat, mengunduh, dan mencoba versi yang lebih canggih ini langsung dari repositori GitHub saya.

::github{repo="masmuss/cli-todo-app"}

---

## Melihat ke Horison - Kekuatan Super Go: Konkurensi

Selamat atas proyek pertamamu! Perjalananmu sebagai Gopher baru saja dimulai. Sekarang, mari kita lihat sekilas ke mana jalan ini bisa membawamu. Salah satu alasan terbesar mengapa perusahaan besar seperti Google, Gojek, dan Netflix memilih Go adalah karena **konkurensi**.

Bayangkan kamu punya satu koki yang memasak satu hidangan satu per satu. Itulah program biasa (sekuensial). Sekarang bayangkan kamu punya 10 koki yang bekerja bersamaan di dapur yang sama. Itulah **konkurensi**, dan Go adalah ahlinya.

Di Go, ini dicapai dengan dua fitur utama:

- `goroutine`: Bayangkan `goroutine` sebagai sebuah fungsi yang bisa berjalan 'bersamaan' dengan fungsi lainnya, tanpa saling menunggu. Mereka sangat ringan dan mudah dibuat, cukup dengan `go namaFungsi()`.
- channel: Ini adalah 'pipa' aman bagi para `goroutine` untuk berkomunikasi dan mengirim data satu sama lain tanpa risiko tabrakan data.

Kalian tidak perlu memahaminya sekarang, tetapi ketahuilah bahwa konsep inilah yang membuat Go sangat _powerful_ untuk membangun server web yang bisa melayani ribuan pengguna sekaligus, memproses data dalam jumlah besar, dan banyak lagi. Inilah petualangan kalian selanjutnya.

---

## Penutup Seri "Becoming Gopher"

Dan dengan itu, seri petualangan **Becoming Gopher** kita sampai pada akhirnya. Kita sudah menempuh perjalanan yang panjang, dari halaman kosong hingga aplikasi yang berfungsi.

Terima kasih sudah mengikuti perjalanan ini dari awal hingga akhir. Semoga seri ini bermanfaat dan bisa menjadi pijakan yang kokoh untuk petualangan Go selanjutnya.
