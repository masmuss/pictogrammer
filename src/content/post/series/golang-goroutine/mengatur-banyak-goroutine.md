---
title: "Becoming Gopher: Konkurensi #3 — Menjadi Konduktor: Mengatur Banyak Channel dengan `select`"
description: "Bagaimana cara menangani banyak channel sekaligus? Pelajari `select`, switch-case versi channel di Go, untuk mengelola timeout, operasi non-blocking, dan pola worker pool."
date: 27 August 2025
tags: ["tech", "golang", "concurrency", "goroutine"]
---

Selamat datang kembali di seri konkurensi **Becoming Gopher**! Di [episode sebelumnya](./menguasai-channel), kita sudah menguasai `channel` sebagai 'pipa' komunikasi yang aman antar `goroutine`. Kita sudah bisa melakukan sinkronisasi dan mengirim data dengan tertib.

Tapi, bagaimana jika petualangan kita menjadi lebih kompleks? Bayangkan sebuah `goroutine` yang harus mendengarkan kabar dari _dua sumber_ berbeda (`channelA` dan `channelB`). Jika kita hanya menunggu dari `channelA`, kita bisa melewatkan pesan penting dari `channelB` yang mungkin datang lebih dulu.

Di sinilah kita butuh peran seorang **konduktor orkestra**. Seorang konduktor bisa memperhatikan banyak musisi sekaligus dan memberi isyarat pada siapa pun yang siap bermain. Di Go, alat untuk menjadi konduktor ini adalah `select`.

## Memperkenalkan `select`: Switch Versi Channel

**`select`** adalah sebuah statement yang memungkinkan sebuah `goroutine` untuk menunggu pada beberapa operasi komunikasi (`channel`) sekaligus.

Strukturnya mirip seperti `switch-case`, tapi setiap `case` adalah sebuah operasi _channel_ (mengirim atau menerima). `select` akan **memblokir** sampai salah satu `case` siap untuk dijalankan, lalu ia akan mengeksekusi `case` tersebut. Jika beberapa `case` siap bersamaan, ia akan memilih salah satunya secara acak.

```go
package main

import (
	"fmt"
	"time"
)

func main() {
	ch1 := make(chan string)
	ch2 := make(chan string)

	go func() {
		time.Sleep(2 * time.Second)
		ch1 <- "Pesan dari channel 1"
	}()

	go func() {
		time.Sleep(1 * time.Second)
		ch2 <- "Pesan dari channel 2"
	}()

	// Kita akan menunggu pesan selama 2 kali
	for i := 0; i < 2; i++ {
		select {
		case msg1 := <-ch1:
			fmt.Println("Menerima:", msg1)
		case msg2 := <-ch2:
			fmt.Println("Menerima:", msg2)
		}
	}
}
```

Output:

```
Menerima: Pesan dari channel 2
Menerima: Pesan dari channel 1
```

`select` dengan cerdas menerima pesan dari ch2 terlebih dahulu karena pesan itu datang lebih cepat.

## Pola Umum: Menambahkan Batas Waktu (Timeout)

Dalam aplikasi nyata, kita tidak bisa membiarkan sebuah operasi menunggu selamanya. Kita butuh batas waktu. `select` membuat pola _timeout_ menjadi sangat mudah diimplementasikan menggunakan fungsi `time.After`.

`time.After(durasi)` akan mengembalikan sebuah _channel_ yang akan mengirimkan nilai setelah durasi yang ditentukan.

```go
func main() {
	ch := make(chan string)

	go func() {
		// Anggap ini adalah tugas yang butuh waktu lama
		time.Sleep(3 * time.Second)
		ch <- "Operasi selesai"
	}()

	select {
	case res := <-ch:
		fmt.Println(res)
	case <-time.After(2 * time.Second):
		fmt.Println("Timeout! Operasi terlalu lama.")
	}
}
```

Output:

```
Timeout! Operasi terlalu lama.
```

Program tidak akan terjebak menunggu selama 3 detik. Setelah 2 detik, `case` timeout akan dijalankan.

## Pola Umum: Operasi Non-Blocking

Terkadang kita hanya ingin "mencoba" mengirim atau menerima dari _channel_ tanpa harus menunggu. Jika _channel_ belum siap, kita ingin langsung melanjutkan pekerjaan lain. Ini bisa dicapai dengan menambahkan `case default` pada `select`.

Jika tidak ada `case` lain yang siap, `default` akan langsung dieksekusi.

```go
func main() {
	messages := make(chan string)

	// Coba terima pesan (non-blocking)
	select {
	case msg := <-messages:
		fmt.Println("Menerima pesan:", msg)
	default:
		fmt.Println("Tidak ada pesan untuk diterima saat ini.")
	}

	// Coba kirim pesan (non-blocking)
	// Jika ada buffer, ini akan berhasil. Jika tidak, default akan jalan.
	select {
	case messages <- "Pesan tes":
		fmt.Println("Pesan berhasil dikirim.")
	default:
		fmt.Println("Tidak ada yang siap menerima pesan.")
	}
}
```

## Pola Konkurensi: Worker Pool

Mari kita gabungkan semua yang telah kita pelajari untuk membangun pola yang sangat umum: **Worker Pool**.

Idenya sederhana: kita punya sekumpulan tugas dan sekumpulan pekerja (`goroutine`). Para pekerja akan mengambil tugas satu per satu, mengerjakannya, dan kita akan mengumpulkan hasilnya.

```go
func worker(id int, jobs <-chan int, results chan<- int) {
	for j := range jobs {
		fmt.Printf("Worker %d memulai tugas %d\n", id, j)
		time.Sleep(time.Second) // Simulasi pekerjaan berat
		fmt.Printf("Worker %d selesai tugas %d\n", id, j)
		results <- j * 2
	}
}

func main() {
	const numJobs = 5
	jobs := make(chan int, numJobs)
	results := make(chan int, numJobs)

	// 1. Jalankan 3 worker
	for w := 1; w <= 3; w++ {
		go worker(w, jobs, results)
	}

	// 2. Kirim 5 tugas ke channel jobs
	for j := 1; j <= numJobs; j++ {
		jobs <- j
	}
	close(jobs)

	// 3. Kumpulkan semua hasil
	for a := 1; a <= numJobs; a++ {
		<-results
	}
	fmt.Println("Semua tugas selesai.")
}
```

Pola ini sangat efisien untuk membatasi jumlah pekerjaan yang berjalan bersamaan dan mengelola beban kerja.

## Petualangan Berlanjut

Kita tidak hanya bisa berkomunikasi, tapi kita sudah bisa menjadi 'konduktor' yang mengatur alur komunikasi dari banyak `goroutine` secara elegan. Dengan `select`, kita bisa menangani _timeout_, melakukan operasi _non-blocking_, dan membangun pola-pola konkurensi yang kompleks seperti _Worker Pool_.

Sejauh ini, kita selalu mengikuti filosofi Go: berkomunikasi dengan mengirim pesan. Tapi, ada kalanya kita terpaksa harus berbagi memori secara langsung, terutama saat performa sangat kritikal.

Di episode selanjutnya dan terakhir dari seri konkurensi ini, kita akan melihat cara yang lebih 'tradisional' untuk sinkronisasi menggunakan paket `sync` dan berkenalan dengan alat pamungkas untuk menemukan _bug_ konkurensi: **Race Detector**.
