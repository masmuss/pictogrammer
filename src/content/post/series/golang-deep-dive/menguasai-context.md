---
title: "Becoming Gopher: Deep Dive #2 — Menguasai Context: Pengendali Jarak Jauh Go"
description: "Di dunia backend, request bisa datang dan pergi. Pelajari bagaimana paket context membantu kita mengelola pembatalan, timeout, dan data antar fungsi dengan elegan."
date: 20 January 2026
tags: ["tech", "golang", "backend"]
---

Selamat datang kembali di seri **Deep Dive**! Jika di postingan sebelumnya kita sudah menguasai Generics, kali ini kita akan membedah salah satu paket paling krusial di ekosistem Go modern: **`context`**.

Jika kamu pernah membuat web server atau berinteraksi dengan database di Go, kamu pasti sering melihat `ctx context.Context` sebagai argumen pertama di hampir semua fungsi. Tapi, apa sebenarnya fungsinya? Mengapa ia ada di mana-mana?

## Apa itu Context?

Bayangkan `context` sebagai sebuah **sinyal pengendali jarak jauh**. 

Saat sebuah request masuk ke server, server mungkin perlu memanggil database, memanggil API eksternal, dan menjalankan beberapa goroutine. Jika tiba-tiba user menutup browser-nya (membatalkan request), kita tentu tidak ingin server terus bekerja sia-sia memproses data tersebut. 

`context` memungkinkan kita mengirim sinyal "Berhenti bekerja!" ke semua fungsi yang terlibat dalam proses tersebut secara serentak.

## Tiga Kegunaan Utama Context

### 1. Pembatalan (Cancellation)
Ini adalah fungsi yang paling mendasar. Kita bisa membuat context yang bisa dibatalkan secara manual menggunakan `context.WithCancel`.

```go
ctx, cancel := context.WithCancel(context.Background())

go func(ctx context.Context) {
    for {
        select {
        case <-ctx.Done():
            fmt.Println("Goroutine: Saya berhenti bekerja.")
            return
        default:
            fmt.Println("Goroutine: Sedang bekerja...")
            time.Sleep(500 * time.Millisecond)
        }
    }
}(ctx)

time.Sleep(2 * time.Second)
cancel() // Kirim sinyal berhenti!
```

### 2. Batas Waktu (Timeout & Deadline)
Seringkali kita tidak ingin sebuah proses berjalan selamanya. Misal, query database tidak boleh lebih dari 5 detik. Kita gunakan `context.WithTimeout`.

```go
ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
defer cancel() // Selalu panggil cancel untuk melepas resource

// Jika proses di bawah makan waktu > 2 detik, ctx.Done() akan terpenuhi
select {
case <-time.After(3 * time.Second):
    fmt.Println("Proses selesai")
case <-ctx.Done():
    fmt.Println("Error:", ctx.Err()) // Output: context deadline exceeded
}
```

### 3. Membawa Data (Context Values)
Meskipun tidak disarankan untuk data besar, `context` bisa membawa data kecil yang relevan sepanjang siklus hidup request, seperti `RequestID` atau `UserID` untuk keperluan logging/tracing.

```go
ctx := context.WithValue(context.Background(), "userID", 123)
val := ctx.Value("userID")
```

## Aturan Emas Menggunakan Context

Sebagai Gopher yang baik, ada beberapa aturan yang harus kita patuhi:

1. **Argumen Pertama**: Selalu letakkan `ctx context.Context` sebagai argumen pertama di fungsi.
2. **Jangan Simpan di Struct**: Context dimaksudkan untuk mengalir antar fungsi, bukan disimpan di dalam sebuah struct (kecuali untuk kasus sangat khusus).
3. **Selalu Panggil Cancel**: Jika kamu menggunakan `WithCancel`, `WithTimeout`, atau `WithDeadline`, pastikan untuk memanggil fungsi `cancel()` (biasanya via `defer`) agar tidak terjadi kebocoran memori.
4. **Hanya untuk Sinyal**: Jangan gunakan context untuk mengirim argumen fungsi yang bersifat opsional. Gunakan context hanya untuk data yang bersifat *request-scoped*.

## Kesimpulan

`context` adalah lem yang merekatkan berbagai bagian dari aplikasi Go kita agar bisa berkomunikasi soal kapan harus berhenti bekerja. Tanpa context, aplikasi backend kita akan sangat rentan terhadap kebocoran resource dan penumpukan proses yang tidak perlu.

Di postingan selanjutnya, kita akan menyelami sisi "magis" Go: **Reflection & Struct Tags**. Kita akan cari tahu bagaimana library seperti JSON serializer bisa tahu nama field di struct kita.

Sampai jumpa di Deep Dive berikutnya! 🚀
