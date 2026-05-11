---
title: "How I Built This: Engineering di Balik Personal Website dengan Astro 6"
description: "Bedah dapur teknis pembangunan website ini. Dari penggunaan Astro 6, Tailwind 4, hingga sistem testing otomatis menggunakan Playwright."
date: 16 May 2026
tags: ["Astro", "TailwindCSS", "Engineering", "Web Development"]
---

Setelah kita menyelesaikan seri **"Becoming Astron"**, mungkin kamu bertanya-tanya: *"Gimana sih implementasi nyata dari semua teori itu?"*

Website yang sedang kamu baca ini bukan sekadar landing page statis. Ini adalah hasil eksperimen saya dalam mencoba berbagai teknologi terbaru (*bleeding edge*) untuk mencapai performa maksimal dan pengalaman pengembang (DX) yang luar biasa.

Mari kita bedah dapur teknisnya.

## 1. The Bleeding Edge Stack

Saya memutuskan untuk menggunakan teknologi terbaru yang mungkin belum banyak diadopsi secara luas di produksi, namun menawarkan lonjakan produktivitas yang signifikan.

### Astro 6 & Content Layer API
Website ini ditenagai oleh **Astro 6**. Salah satu fitur favorit saya adalah **Content Layer API**. Alih-alih hanya membaca file Markdown secara manual, Astro sekarang memungkinkan kita mendefinisikan skema konten yang ketat menggunakan Zod di `content.config.ts`.

Ini memberikan *type-safety* penuh. Jika saya lupa menambahkan tag atau format tanggal salah, build akan langsung gagal. Tidak ada lagi error runtime yang misterius.

### Tailwind CSS 4 (Beta/Vite Plugin)
Saya menggunakan **Tailwind CSS 4**. Berbeda dengan versi 3, versi ini sudah terintegrasi sebagai Vite plugin. Hasilnya? Build time yang jauh lebih cepat dan konfigurasi yang lebih sederhana karena hampir semuanya dilakukan secara deklaratif.

### Biome.js & Prettier: Tim Linter & Formatter yang Tangguh
Banyak yang bertanya, kenapa tidak pakai Biome untuk semuanya? Di project ini, saya menggunakan **Biome** khusus sebagai linter karena kecepatannya yang luar biasa dalam mendeteksi potensi bug dan error.

Namun, untuk urusan formatting, **Prettier** masih menjadi juaranya. Kenapa? Karena ekosistem plugin Prettier sangat kaya dan spesifik, seperti `prettier-plugin-astro` untuk file `.astro`, `prettier-plugin-tailwindcss` untuk merapikan class, hingga plugin untuk mengurutkan isi `package.json`. Kombinasi ini memberikan saya linter yang secepat kilat namun dengan hasil formatting yang tetap cantik dan terstandarisasi.

## 2. Arsitektur Konten

Konten di website ini dikelola dalam beberapa koleksi:
- `post`: Untuk tulisan blog umum.
- `series`: Untuk mengelompokkan tulisan ke dalam satu kurikulum.
- `experiences` & `certifications`: Data profesional yang ditampilkan di halaman About.

Semua data ini disimpan dalam format Markdown atau JSON, namun diakses melalui API seragam milik Astro.

## 3. Menjaga Kualitas: Testing di Personal Web?

Mungkin terdengar berlebihan, tapi saya memasang sistem testing yang cukup lengkap:

- **Vitest:** Untuk menguji fungsi utilitas seperti kalkulasi waktu baca (*reading time*) dan manipulasi string.
- **Playwright:** Ini bagian yang seru. Saya menggunakan Playwright untuk **Visual Regression Testing**. Setiap kali saya mengubah CSS, Playwright akan membandingkan screenshot website dengan versi sebelumnya untuk memastikan tidak ada UI yang "meleyot" secara tidak sengaja.
- **A11y Testing:** Menggunakan `@axe-core/playwright` untuk memastikan website ini aksesibel bagi semua orang.

## 4. Performance & Optimasi Gambar

Website yang lambat adalah dosa besar dalam web development. Di sini, saya menerapkan beberapa teknik:

- **Astro Assets & Sharp:** Semua gambar di website ini diproses secara otomatis oleh Astro menggunakan library **Sharp**. Gambar dikonversi ke format modern seperti WebP atau AVIF dan di-resize sesuai kebutuhan secara otomatis.
- **Self-hosted Fonts:** Saya tidak menggunakan Google Fonts secara langsung. Dengan **Fontsource** dan konfigurasi font di Astro, semua font di-host secara mandiri. Ini menghilangkan *layout shift* (CLS) dan mempercepat pemuatan halaman.
- **Dynamic OG Image dengan Satori:** Seperti yang sempat saya singgung, saya menggunakan **Satori** untuk mengotomatisasi pembuatan thumbnail artikel. Ini menghemat waktu saya dan memastikan setiap artikel memiliki representasi visual yang profesional saat dibagikan.

## 5. Kesimpulan

Membangun personal website adalah kesempatan terbaik bagi kita sebagai engineer untuk bermain dengan teknologi yang kita sukai tanpa hambatan *legacy code* perusahaan.

Website ini adalah bukti bahwa dengan **Astro**, kita bisa mendapatkan yang terbaik dari dua dunia: performa website statis yang instan, namun dengan kapabilitas engineering yang sangat powerful.

**Apa selanjutnya?**
Rencana saya adalah mengintegrasikan sistem pencarian (*full-text search*) dan mungkin menambahkan sedikit interaktivitas menggunakan komponen React di beberapa bagian yang membutuhkan state kompleks.

Sampai jumpa di artikel berikutnya!
