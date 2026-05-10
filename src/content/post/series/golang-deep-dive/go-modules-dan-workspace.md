---
title: "Becoming Gopher: Deep Dive #4 — Manajemen Proyek Besar: Go Modules & Workspace"
description: "Mengelola satu proyek Go mungkin mudah. Tapi bagaimana jika kamu punya banyak modul yang saling bergantung? Mari pelajari teknik manajemen dependency tingkat lanjut."
date: 22 January 2026
tags: ["tech", "golang", "productivity"]
---

Saat kita pertama kali belajar Go, kita cukup menjalankan `go mod init` dan segalanya berjalan lancar. Namun, seiring bertambahnya skala proyek—misalnya saat kamu membangun monorepo atau library yang saling bergantung—manajemen modul bisa menjadi tantangan tersendiri.

Kali ini kita akan membahas teknik profesional untuk mengelola proyek Go berskala besar.

## Go Modules: Lebih dari Sekadar `go.mod`

`go.mod` adalah daftar belanjaan untuk proyekmu. Namun, ada satu file lagi yang sering diabaikan: **`go.sum`**.

File `go.sum` berisi *checksum* (sidik jari digital) dari setiap modul yang kamu unduh. Fungsinya sangat krusial untuk keamanan: ia memastikan bahwa kode library yang kamu gunakan hari ini adalah kode yang **sama persis** dengan yang digunakan oleh rekan timmu atau server production. Jangan pernah menghapus file ini secara manual!

## Versi Modul (Semantic Versioning)

Go sangat menghargai *Semantic Versioning* (v1.2.3). Namun, ada aturan khusus untuk versi besar (v2 ke atas):
Go mewajibkan kamu menambahkan akhiran versi pada path modul, contoh: `github.com/user/project/v2`. Ini dilakukan untuk menghindari "Dependency Hell" di mana dua library berbeda membutuhkan versi v1 dan v2 dari modul yang sama.

## Menggunakan `go work` (Multi-module Workspace)

Pernahkah kamu berada dalam situasi ini:
Kamu sedang mengembangkan **Library A** dan **Aplikasi B** secara bersamaan. Aplikasi B bergantung pada Library A. Setiap kali kamu mengubah kode di Library A, kamu harus melakukan *push* ke GitHub agar bisa dicoba di Aplikasi B. Merepotkan, bukan?

Solusinya adalah **Go Workspace**.

1. Buat file `go.work` di folder induk:
   ```bash
   go work init ./library-a ./aplikasi-b
   ```
2. Sekarang, saat kamu menjalankan Aplikasi B, Go akan otomatis mencari kode Library A di folder lokalmu, bukan mengunduhnya dari internet.

Ini adalah *game changer* untuk produktivitas saat bekerja dengan banyak modul secara lokal.

## Mengelola Versi dengan `go mod tidy`

Biasanya kita hanya menjalankan `go mod tidy` untuk membersihkan library yang tidak terpakai. Tapi tahukah kamu kalau perintah ini juga melakukan verifikasi terhadap integritas `go.mod`? Biasakan menjalankan perintah ini sebelum melakukan *commit* untuk memastikan proyekmu dalam kondisi "sehat".

## Kesimpulan

Manajemen modul yang baik adalah tanda kematangan seorang Gopher. Dengan memahami `go.sum`, Semantic Versioning, dan kekuatan `go work`, kamu siap menangani proyek Go dengan kompleksitas apa pun.

Di postingan selanjutnya, kita akan membahas topik yang sangat disukai oleh para pencinta kecepatan: **Profiling & Optimization**. Kita akan belajar cara menemukan "pencuri" performa di aplikasi kita.

Tetap semangat belajar, Gopher! 🚀
