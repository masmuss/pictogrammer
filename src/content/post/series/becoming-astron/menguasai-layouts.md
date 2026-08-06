---
title: "Becoming Astron #11 — Menguasai Layouts: Mengatur Kerangka Halaman Tanpa Repot"
description: "Menulis tag <html> dan <head> berulang kali di setiap halaman itu melelahkan. Di tulisan ini, kita belajar cara menggunakan Layout di Astro agar kode kita lebih rapi dan konsisten."
date: 09 May 2026
tags: ["astro", "tech"]
---

Pada tulisan sebelumnya, kita berhasil membuat halaman pertama dan kedua di Astro. Tapi kalau kamu perhatikan, ada satu masalah: kita harus menulis struktur HTML lengkap (`<html>`, `<head>`, `<body>`) di setiap file.

Jika kita punya 100 halaman, dan kita ingin mengubah satu kata di `<head>`, kita harus mengedit 100 file. Tentu kita tidak ingin itu terjadi. Di sinilah **Layout** datang menyelamatkan kita.

## Apa Itu Layout?

Layout adalah komponen Astro yang berfungsi sebagai "kerangka" atau "template" untuk halaman-halamanmu. Alih-alih menulis struktur HTML di setiap halaman, kita cukup menulisnya **sekali** di Layout, lalu halaman-halaman lain akan "meminjam" kerangka tersebut.

## Langkah 1: Membuat File Layout

Secara konvensi, layout diletakkan di folder `src/layouts/`. Mari kita buat file bernama `MainLayout.astro`:

```astro title="src/layouts/MainLayout.astro"
---
const { title } = Astro.props;
---

<html lang="id">
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width" />
		<title>{title} | My Astron Blog</title>
	</head>
	<body>
		<nav>
			<a href="/">Beranda</a> | <a href="/tentang">Tentang</a>
		</nav>
		<hr />

		<main>
			<!-- Tempat konten halaman akan muncul -->
			<slot />
		</main>

		<footer style="margin-top: 2rem;">
			<p>&copy; 2026 Menjadi Astron</p>
		</footer>
	</body>
</html>
```

## Mengenal Tag `<slot />`

Bagian paling ajaib dari sebuah Layout adalah tag `<slot />`.

Tag ini adalah "lubang" atau tempat penampung. Ketika sebuah halaman menggunakan layout ini, semua konten yang ada di dalam halaman tersebut akan dimasukkan ke posisi di mana `<slot />` berada.

## Langkah 2: Menggunakan Layout di Halaman

Sekarang, mari kita ubah file `src/pages/index.astro` agar menggunakan layout yang baru saja kita buat:

```astro title="src/pages/index.astro"
---
import MainLayout from "../layouts/MainLayout.astro";
---

<MainLayout title="Selamat Datang">
	<h1>Halo, Dunia Astro!</h1>
	<p>Sekarang kodenya jauh lebih bersih, kan?</p>
</MainLayout>
```

Lihat betapa ringkasnya file `index.astro` sekarang? Kita tidak perlu lagi menulis `<head>` atau `<body>`. Cukup bungkus konten kita dengan `<MainLayout>`.

## Mengirim Data ke Layout (Props)

Perhatikan bagaimana kita mengirim `title="Selamat Datang"` ke komponen `<MainLayout>`. Di dalam file layout, kita menangkapnya dengan:

```astro
const {title} = Astro.props;
```

Ini memungkinkan setiap halaman memiliki judul yang berbeda-beda meskipun menggunakan kerangka yang sama.

## Kenapa Ini Penting?

1. **Konsistensi**: Navbar dan Footer kamu akan selalu sama di semua halaman.
2. **DRY (Don't Repeat Yourself)**: Kamu tidak menduplikasi kode yang sama berulang-ulang.
3. **Mudah Dikelola**: Ingin menambah library CSS baru? Cukup tambah satu baris di `MainLayout.astro`, dan semua halaman akan langsung mendapatkannya.

:::tip
Kamu bahkan bisa membuat Layout di dalam Layout! Misalnya, `BlogPostLayout` yang menggunakan `MainLayout` sebagai dasarnya.
:::

## Apa Selanjutnya?

Sekarang kerangka website kita sudah rapi. Tapi, tampilannya masih sangat polos (HTML murni). Di tulisan berikutnya, kita akan membahas bagaimana memberikan gaya pada website kita dengan **Styling di Astro**—mulai dari Scoped CSS hingga integrasi Tailwind CSS.

Siap mempercantik website pertamamu? Sampai jumpa di tulisan berikutnya!
