---
title: "Becoming Gopher: Konkurensi #4 — Jaring Pengaman: Sinkronisasi dengan `sync` & Race Detector"
description: "Pelajari cara 'tradisional' sinkronisasi dengan sync.Mutex dan sync.WaitGroup, dan temukan alat pamungkas Go untuk mendeteksi race condition secara otomatis."
date: 28 August 2025
tags: ["tech", "golang", "concurrency", "goroutine"]
---

Selamat datang di babak **final** dari seri konkurensi **Becoming Gopher**! Sejauh ini, kita telah mengikuti filosofi Go: berkomunikasi antar `goroutine` dengan mengirim pesan melalui `channel`. Ini adalah cara yang elegan dan aman.

Tapi, terkadang ada situasi di mana berbagi memori secara langsung tidak bisa dihindari, terutama untuk alasan performa atau saat berinteraksi dengan _library_ eksternal. Untuk kasus-kasus ini, Go menyediakan 'jaring pengaman' di dalam paket `sync`.

Di episode terakhir ini, kita akan membahas:

1.  **`sync.Mutex`**: Cara mengunci data agar hanya bisa diakses oleh satu `goroutine` pada satu waktu.
2.  **`sync.WaitGroup`**: Cara elegan untuk menunggu sekelompok `goroutine` menyelesaikan tugasnya.
3.  **Race Detector**: Alat pamungkas dari Go untuk mendeteksi _bug_ konkurensi secara otomatis.

## `sync.Mutex`: Satu Ruangan, Satu Kunci

Ingat masalah _race condition_ pada _counter_ kita di [postingan pertama](./pengenalan-konkurensi-goroutine)? Banyak `goroutine` mencoba mengubah variabel yang sama secara bersamaan, menyebabkan kekacauan.

Paket `sync` menyediakan solusi klasik untuk ini: **Mutex** (_Mutual Exclusion_).

Bayangkan variabel `counter` kita berada di dalam sebuah ruangan. `Mutex` adalah **satu-satunya kunci** untuk masuk ke ruangan itu. Sebelum sebuah `goroutine` bisa mengubah `counter`, ia harus mengambil kunci (`Lock`). Setelah selesai, ia harus mengembalikan kunci (`Unlock`) agar `goroutine` lain bisa masuk. Yang lain harus antre dengan tertib.

Mari kita perbaiki kode _counter_ kita menggunakan `Mutex`.

```go
package main

import (
	"fmt"
	"sync"
)

func main() {
	var wg sync.WaitGroup
	var mu sync.Mutex // Membuat 'kunci'
	counter := 0

	for i := 0; i < 1000; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()

			mu.Lock() // Ambil kunci sebelum mengakses counter
			counter++
			mu.Unlock() // Kembalikan kunci setelah selesai
		}()
	}

	wg.Wait()
	fmt.Println("Nilai akhir counter:", counter) // Output: 1000
}
```

Dengan `Mutex`, hasilnya sekarang selalu konsisten: **1000**.

:::note
Praktik Terbaik: Selalu gunakan `defer mu.Unlock()` tepat setelah `mu.Lock()` untuk memastikan kunci pasti dikembalikan, bahkan jika terjadi `panic`.

```go
go func() {
    defer wg.Done()
    mu.Lock()
    defer mu.Unlock() // Kunci pasti akan dikembalikan
    counter++
}()
```

:::

## `sync.WaitGroup`: Menunggu Rombongan Sampai Selesai

Di postingan pertama, kita juga punya masalah di mana `main goroutine` selesai duluan. Solusi sementara kita adalah `time.Sleep()`, yang sangat buruk. `sync.WaitGroup` adalah solusi yang benar untuk masalah ini.

Bayangkan `WaitGroup` sebagai seorang mandor proyek yang tahu persis berapa banyak pekerja yang harus ia tunggu.

Ia memiliki tiga operasi utama:

1. `Add(n)`: Mandor berkata, "Saya menunggu `n` pekerja."
2. `Done()`: Setiap pekerja, setelah selesai, melapor, "Tugas saya selesai!". Ini akan mengurangi hitungan mandor sebanyak satu.
3. `Wait()`: Mandor akan berhenti dan menunggu di sini sampai hitungannya menjadi nol.

```go
func worker(id int, wg *sync.WaitGroup) {
	// Pastikan worker melapor 'Done' saat fungsinya berakhir
	defer wg.Done()

	fmt.Printf("Worker %d mulai bekerja.\n", id)
	time.Sleep(time.Second)
	fmt.Printf("Worker %d selesai.\n", id)
}

func main() {
	var wg sync.WaitGroup

	// 1. Beri tahu WaitGroup kita akan menunggu 3 worker
	wg.Add(3)

	for i := 1; i <= 3; i++ {
		go worker(i, &wg)
	}

	// 3. Tunggu sampai semua worker memanggil Done()
	wg.Wait()

	fmt.Println("Semua pekerjaan telah diselesaikan.")
}
```

Tidak ada lagi tebak-tebakan. Program akan menunggu persis selama yang dibutuhkan.

## Alat Pamungkas: Race Detector

Bagaimana jika kita tidak sengaja lupa menggunakan _mutex_ atau _channel_? Apakah kita harus mencari bug-nya semalaman? Tentu tidak. Tim Go telah memberi kita alat pamungkas: **Race Detector**.

Ini adalah fitur bawaan yang bisa diaktifkan saat menjalankan program. Ia akan memantau akses memori dan melaporkan jika ada potensi _race condition_.

Cukup tambahkan flag `-race` saat menjalankan kodemu.

```bash
go run -race namafile.go
```

Jika kita menjalankan kode _counter_ yang salah (tanpa `Mutex`) dengan _race detector_, kita akan mendapatkan laporan yang sangat jelas seperti ini:

```plaintext
==================
WARNING: DATA RACE
Write at 0x0000012e62d8 by goroutine 8:
  main.main.func1()
      /path/to/project/main.go:18 +0x3c

Previous read at 0x0000012e62d8 by goroutine 7:
  main.main.func1()
      /path/to/project/main.go:18 +0x28
...
Found 1 data race(s)
exit status 66
```

Laporan ini memberitahu kita:

- **Ada data race.**
- Operasi **tulis** oleh `goroutine 8` di `main.go` baris 18.
- Bertabrakan dengan operasi **baca** oleh `goroutine 7` di `main.go` baris 18.

Membiasakan diri menggunakan `-race` saat pengembangan adalah jaring pengaman terbaik saat menulis kode konkuren.

## Akhir dari Petualangan Konkurensi

Selamat! Anda telah menyelesaikan salah satu topik paling menantang dan paling bermanfaat di Go. Anda sekarang memiliki fondasi yang kuat untuk membangun aplikasi yang cepat, efisien, dan tangguh.

Dalam seri ini, kita telah melakukan perjalanan dari:

- Melepaskan kekuatan `goroutine`.
- Berkomunikasi dengan aman melalui `channel`.
- Mengorkestrasi banyak _channel_ dengan `select`.
- Menggunakan `sync` sebagai jaring pengaman dan mendeteksi masalah dengan **Race Detector**.

Ingatlah selalu filosofi Go: **"Jangan berkomunikasi dengan berbagi memori; sebaliknya, berbagilah memori dengan berkomunikasi."** Utamakan _channels_ jika memungkinkan, dan gunakan `sync` saat diperlukan.

Terima kasih telah mengikuti seri konkurensi ini.
