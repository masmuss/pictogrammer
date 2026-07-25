---
title: "How I Built This: Engineering di Balik Personal Website dengan Astro 6"
description: "Bedah dapur teknis pembangunan website ini. Dari penggunaan Astro 6, Tailwind 4, hingga sistem testing otomatis menggunakan Playwright."
date: 16 May 2026
tags: ["Astro", "TailwindCSS", "Engineering", "Web Development"]
---

Setelah menyelesaikan seri "Becoming Astron", mungkin kamu penasaran: seperti apa implementasi nyata dari semua konsep itu?

Website yang kamu baca sekarang adalah hasil dari beberapa kali rewrite, banyak kompromi, dan satu keputusan yang mungkin sedikit berlebihan: memasang testing suite di personal blog. Mari saya tunjukkan apa yang saya pakai dan kenapa.

## Stack: Yang Saya Pakai dan Alasannya

### Astro 6 + Content Layer API

Astro 6 membawa Content Layer API — cara baru mengelola konten dengan skema yang ketat. Saya pakai Zod di `content.config.ts` untuk mendefinisikan struktur setiap koleksi.

Enaknya: kalau saya lupa menambahkan tag atau format tanggal salah, build langsung gagal. Tidak ada runtime error misterius yang baru ketahuan setelah deploy. Sebagai seseorang yang sering lupa hal-hal kecil, ini penyelamat.

Sisi yang kurang enak: Content Layer API di Astro 6 masih baru. Dokumentasi untuk edge case tertentu masih tipis, dan beberapa pattern yang saya pakai mungkin berubah di minor release berikutnya. Saya oke dengan risiko itu — ini personal website, bukan production system dengan SLA.

### Tailwind CSS 4

Tailwind 4 terintegrasi sebagai Vite plugin, bukan PostCSS plugin seperti versi 3. Build time lebih cepat, dan konfigurasi sekarang deklaratif — hampir semua hal cukup di CSS, tanpa `tailwind.config.js` yang membengkak.

Yang butuh penyesuaian: sintaks class sedikit berubah, dan beberapa plugin Tailwind v3 belum mendukung v4. Tapi untuk kebutuhan website ini, semuanya ter-cover.

### Biome + Prettier: Dua Alat, Satu Peran yang Berbeda

Orang sering tanya: kalau Biome bisa formatting dan linting, kenapa masih pakai Prettier?

Biome saya pakai khusus sebagai linter. Kecepatannya jauh di atas ESLint — untuk project kecil seperti ini, perbedaannya memang tidak terasa, tapi saya suka bahwa Biome selesai dalam hitungan milidetik.

Untuk formatting, saya tetap pakai Prettier. Alasannya bukan kecepatan, tapi ekosistem plugin: `prettier-plugin-astro` untuk file `.astro`, `prettier-plugin-tailwindcss` untuk merapikan class, dan plugin untuk mengurutkan `package.json`. Biome belum punya pengganti yang setara untuk ketiganya.

Kombinasi ini tidak rapi secara filosofis — dua alat yang tumpang tindih. Tapi secara praktis, ini bekerja. Kadang itu yang lebih penting.

## Arsitektur Konten

Konten website ini dikelola dalam beberapa koleksi:

- `post` — tulisan blog umum
- `series` — seri terkurasi seperti Becoming Astron
- `experiences` dan `certifications` — data profesional di halaman About

Semua disimpan sebagai Markdown atau JSON, tapi diakses melalui API seragam dari Content Layer. Tidak ada CMS eksternal, tidak ada database. Cukup file teks dalam repo.

## Testing: Berlebihan atau Perlu?

Saya tahu ini personal blog. Tapi saya tetap memasang testing:

- **Vitest** — untuk utility functions seperti kalkulasi reading time dan manipulasi string. Ini hal kecil, tapi fun fact: implementasi reading time saya sempat salah karena tidak menghitung kata dalam bahasa Indonesia dengan benar (bahasa Indonesia punya pola suku kata yang berbeda dari bahasa Inggris). Test menangkap ini.

- **Playwright** — untuk visual regression testing. Setiap saya mengubah CSS, Playwright membandingkan screenshot sebelum dan sesudah. Ini sudah menyelamatkan saya dua kali: sekali ketika refactor layout tidak sengaja merusak halaman series di mobile, dan sekali ketika upgrade Tailwind mengubah default spacing.

- **`@axe-core/playwright`** — aksesibilitas testing. Saya tidak punya disabilitas visual, jadi saya tidak tahu kalau kontras warna di beberapa bagian sebenarnya di bawah threshold WCAG sampai test ini memberitahu. Sekarang jadi kebiasaan: setiap komponen baru, cek a11y dulu.

Apakah semua ini berlebihan untuk personal blog? Mungkin. Tapi setup ini memakan waktu satu sore, dan sudah menangkap bug yang tidak akan saya sadari sendiri. Untuk saya, itu worth it.

## Optimasi yang Terasa, dan yang Tidak

**Yang terasa:**

Gambar diproses otomatis lewat Astro Assets + Sharp — dikonversi ke WebP/AVIF, di-resize sesuai ukuran viewport. Saya tidak perlu menyentuh ImageMagick atau online compressor lagi.

Font di-host sendiri lewat Fontsource. Tidak ada request ke Google Fonts, tidak ada layout shift (CLS) karena font terlambat loading.

**Yang mungkin overkill:**

Dynamic OG image pakai Satori. Ini keren — setiap artikel dapat thumbnail otomatis tanpa saya harus buka Figma. Tapi setup awalnya memakan waktu lebih lama dari yang saya kira, dan debugging Satori di edge case (font fallback untuk karakter non-Latin) cukup menyebalkan. Kalau ada yang ingin pakai Satori: pastikan font kamu mendukung semua karakter yang mungkin muncul di judul.

## Penutup

Saya membangun website ini karena saya ingin tempat yang sepenuhnya milik sendiri — tidak ada batasan platform, tidak ada algoritma, tidak ada iklan.

Teknologinya mungkin berubah tahun depan. Mungkin saya akan ganti Tailwind dengan sesuatu yang lebih ringan, atau menambahkan search engine, atau malah merombak ulang semuanya. Tapi proses membangunnya — memahami trade-off, memilih mana yang perlu dan mana yang berlebihan — itu yang membuatnya berharga.

Kalau kamu sedang membangun website sendiri dan ingin tanya sesuatu tentang stack di atas, kirim pesan saja. Saya tidak janji bisa menjawab semua, tapi saya bisa cerita bagian mana yang nyesel dan bagian mana yang ternyata keputusan bagus.

Sampai nanti di rewrite berikutnya.
