---
title: "Becoming Gopher: Konkurensi #1 — Kekuatan Super Go: Pengenalan Konkurensi & Goroutine"
description: "Mulai seri konkurensi dengan mempelajari apa itu goroutine, betapa mudahnya menjalankannya, dan masalah-masalah awal yang akan kita hadapi seperti race condition."
date: 25 August 2025
tags: ["tech", "golang", "concurrency", "goroutine"]
---

Selamat datang di petualangan baru dalam seri **Becoming Gopher**! Sejauh ini, kita telah menguasai fondasi Go, mulai dari tipe data hingga membangun proyek. Sekarang, saatnya kita membuka 'kekuatan super' yang membuat Go begitu istimewa dan dicintai di dunia _backend_: **Konkurensi**.

## Apa itu Konkurensi? (Jangan Tertukar dengan Paralelisme)

Sebelum melangkah lebih jauh, mari kita luruskan pemahaman. Bayangkan seorang koki di dapur.

- **Konkurensi:** Satu koki yang menangani banyak tugas sekaligus. Dia mulai merebus air, lalu sambil menunggu, dia memotong bawang. Setelah itu, dia menumis bumbu sambil sesekali mengaduk air rebusan. Dia menangani **banyak tugas dalam satu periode waktu**, tapi tidak benar-benar melakukan semuanya pada detik yang sama.
- **Paralelisme:** Ada empat koki di dapur. Satu merebus air, satu memotong bawang, satu menumis, dan satu lagi menyiapkan piring. Mereka **benar-benar melakukan banyak tugas pada saat yang bersamaan**.

Go memudahkan kita untuk menulis program yang **konkuren**. Jika Kalian memiliki perangkat keras yang mendukung (CPU dengan banyak inti), Go akan secara otomatis menjalankan kode konkuren Kalian secara **paralel**.

## Memperkenalkan `goroutine`: Pekerja Super Ringan

Di Go, unit dasar dari konkurensi adalah **goroutine**. Anggap saja `goroutine` adalah sebuah fungsi yang berjalan di 'latar belakang' secara independen dari fungsi utama.

Yang membuatnya istimewa adalah `goroutine` sangat ringan. Kalian bisa menjalankan ratusan ribu `goroutine` tanpa membuat sistem Kalian terbebani, sesuatu yang tidak mungkin dilakukan dengan _thread_ tradisional.

Memulai sebuah `goroutine` sangatlah mudah. Cukup tambahkan kata kunci `go` di depan pemanggilan fungsi.

```go
package main

import (
	"fmt"
	"time"
)

func say(text string) {
	for i := 0; i < 3; i++ {
		fmt.Println(text)
		time.Sleep(100 * time.Millisecond)
	}
}

func main() {
	// Menjalankan say("Halo") sebagai goroutine baru
	go say("Halo")

	// Menjalankan say("Dunia") di main goroutine
	say("Dunia")
}
```

Outputnya mungkin akan mengejutkan:

```plaintext
Dunia
Halo
Dunia
Halo
Dunia
Halo
```

Seperti yang Kalian lihat, "Halo" dan "Dunia" dicetak bergantian. Ini bukti bahwa dua fungsi `say` berjalan secara bersamaan!

## Masalah Pertama: Main `Goroutine` Tidak Menunggu

Mari kita coba ubah sedikit kode di atas. Bagaimana jika kedua fungsi dijalankan sebagai `goroutine`?

```go
func main() {
	go say("Halo")
	go say("Dunia")
}
```

Jika Kalian menjalankan ini, program akan langsung selesai tanpa mencetak apa pun! Mengapa?

Fungsi `main()` itu sendiri berjalan di dalam sebuah `goroutine` utama (_main goroutine_). Aturannya adalah: **jika main goroutine selesai, seluruh program akan berhenti**, tanpa peduli `goroutine` lain masih bekerja atau tidak.

Untuk membuktikannya, kita bisa melakukan "trik kotor" dengan memaksa `main` menunggu sejenak.

```go
func main() {
	go say("Halo")
	go say("Dunia")

    // HANYA UNTUK DEMONSTRASI, JANGAN DITIRU!
	time.Sleep(500 * time.Millisecond)
	fmt.Println("Selesai")
}
```

Sekarang outputnya akan muncul. Tapi ini adalah praktik yang sangat buruk karena kita tidak tahu pasti berapa lama `goroutine` lain butuh waktu. Kita butuh cara yang lebih baik untuk sinkronisasi.

## Masalah Kedua: Berebut Data (_Race Condition_)

Masalah yang lebih berbahaya muncul saat beberapa `goroutine` mencoba mengakses dan mengubah data yang sama pada saat bersamaan. Ini disebut **Race Condition**.

Bayangkan dua orang mencoba mengedit angka yang sama di satu papan tulis. Orang pertama membaca angka '5', ingin menambahkannya menjadi '6'. Pada saat yang sama, orang kedua juga membaca angka '5' dan ingin menambahkannya. Keduanya menulis '6' di papan tulis. Hasil akhirnya 6, padahal seharusnya 7!

Mari kita lihat dalam kode:

```go
package main

import (
	"fmt"
	"sync"
)

func main() {
	// Kita butuh WaitGroup untuk menunggu semua goroutine selesai.
    // Kita akan bahas ini di postingan selanjutnya, untuk sekarang terima saja dulu :)
	var wg sync.WaitGroup
	counter := 0

	// Jalankan 1000 goroutine, masing-masing menaikkan counter
	for i := 0; i < 1000; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			counter++
		}()
	}

	wg.Wait() // Tunggu semua goroutine selesai
	fmt.Println("Nilai akhir counter:", counter)
}
```

Jika Kalian menjalankan kode ini, hasil `counter` **hampir tidak akan pernah 1000**. Hasilnya akan acak, misalnya 981, 995, atau angka lainnya. Ini karena ribuan `goroutine` saling "balapan" untuk membaca dan menulis variabel `counter`.

## Petualangan Baru Saja Dimulai

Hari ini kita sudah berhasil membuka 'kekuatan super' Go dengan `goroutine`. Kita sudah bisa 'memerintahkan' banyak pekerjaan untuk berjalan bersamaan.

Namun, kita juga menemukan dua masalah besar:

1. Bagaimana cara menunggu `goroutine` menyelesaikan tugasnya dengan benar?
2. Bagaimana cara `goroutine` berinteraksi dengan data yang sama secara aman tanpa menyebabkan _race condition_?

Bagaimana cara agar para 'pekerja' ini bisa berkomunikasi dengan aman dan berbaris dengan rapi? Jawabannya ada pada salah satu fitur paling elegan di Go: **Channels**.

Kita akan membahasnya tuntas di episode selanjutnya!
