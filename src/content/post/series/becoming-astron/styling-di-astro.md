---
title: "Becoming Astron #12 — Styling di Astro: Cantik Tanpa Konflik"
description: "Web tanpa gaya itu seperti rumah tanpa cat. Mari belajar bagaimana Astro mengelola CSS agar tetap rapi, ringan, dan bebas dari konflik antar komponen."
date: 10 May 2026
tags: ["astro", "tech"]
---

Setelah punya kerangka (Layout), sekarang saatnya kita mempercantik website kita. Salah satu hal paling menyenangkan di Astro adalah bagaimana ia memperlakukan CSS.

Secara default, Astro mendukung **Scoped CSS**. Apa itu? Mari kita bahas.

## Scoped CSS: Gaya yang Sopan

Pernahkah kamu menulis CSS untuk tombol di satu tempat, tapi tiba-tiba semua tombol di seluruh website ikut berubah? Di Astro, itu tidak akan terjadi jika kamu menulis CSS di dalam tag `<style>` pada komponen `.astro`.

```astro title="src/components/Button.astro"
<button class="my-button">Klik Saya</button>

<style>
	.my-button {
		background-color: purple;
		color: white;
		padding: 10px 20px;
		border-radius: 8px;
	}
</style>
```

Astro akan otomatis menambahkan "id unik" pada class tersebut saat build, sehingga gaya `.my-button` ini **hanya akan berpengaruh** pada komponen `Button.astro` saja. Sangat rapi dan aman!

## Global CSS: Gaya untuk Semua

Tentu kita tetap butuh gaya global (seperti reset CSS, font default, atau warna latar belakang seluruh body). Caranya:

1. Buat file CSS, misal `src/styles/global.css`.
2. Import file tersebut di dalam Layout utama kita.

```astro title="src/layouts/MainLayout.astro"
---
import "../styles/global.css";
---

<!-- Struktur HTML -->
```

Sekarang, semua aturan di `global.css` akan berlaku di seluruh halaman yang menggunakan layout tersebut.

## Menggunakan Tailwind CSS

Jika kamu pecinta Tailwind, Astro membuatnya sangat mudah. Kamu tidak perlu setup manual yang rumit. Cukup jalankan perintah:

```bash
npx astro add tailwind
```

Astro akan otomatis menginstall dependency dan mengonfigurasi file yang dibutuhkan. Setelah itu, kamu bisa langsung pakai class Tailwind di mana saja!

```astro
<h1 class="text-3xl font-bold text-indigo-600 underline">Halo, Tailwind!</h1>
```

## Kenapa Styling di Astro Terasa Lebih Ringan?

Astro hanya akan mengirimkan CSS yang **benar-benar dipakai** di halaman yang sedang dibuka oleh user. Jika halaman A pakai class Tailwind tertentu dan halaman B tidak, maka di halaman B, CSS tersebut tidak akan dikirim.

Hasilnya? Bundle CSS yang sangat kecil dan loading yang lebih cepat.

## Tips Astron

Jangan ragu untuk mencampur Scoped CSS dan Tailwind. Gunakan Tailwind untuk layouting cepat, dan gunakan Scoped CSS (tag `<style>`) untuk logika styling yang sangat spesifik atau animasi yang kompleks.

Di tulisan berikutnya, kita akan belajar hal yang lebih seru: **Dynamic Routes**. Bagaimana caranya membuat 100 halaman berbeda hanya dengan 1 file? Sampai jumpa besok!
