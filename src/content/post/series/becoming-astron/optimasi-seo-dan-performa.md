---
title: "Becoming Astron #9 — Optimasi SEO dan Performa: Cepat Sejak Lahir"
description: "Astro membuat website cepat bukan sebagai fitur tambahan, tapi sebagai bawaan. Mari bahas bagaimana SEO dan performa bekerja secara otomatis di Astro."
date: 11 January 2026
tags: ["astro", "tech"]
---

Kita sampai di penghujung **Bagian 1: Fondasi**.

Banyak framework menjanjikan "performa tinggi", tapi biasanya itu butuh kerja keras dari developer (optimasi gambar, lazy loading, dll). Di Astro, performa tinggi adalah **pengaturan default**.

## SEO yang "Gratis"

SEO (Search Engine Optimization) sangat bergantung pada seberapa mudah mesin pencari (seperti Google) membaca kontenmu.

- **Framework SPA**: Google harus menjalankan JavaScript dulu untuk melihat konten. Kadang ini lambat atau gagal.
- **Astro**: Google menerima HTML murni yang sudah berisi semua teks. Sangat mudah diindeks, sangat cepat dipahami.

Di Astro, kamu punya kendali penuh atas tag `<head>`, `<title>`, dan `<meta>` di setiap halaman tanpa perlu library tambahan seperti `react-helmet`.

## Performa: Rahasia di Balik Kecepatan

Kenapa Astro terasa sangat cepat?

1. **Zero JS by Default**: Browser tidak perlu mengunduh, mem-parsing, dan menjalankan JavaScript jika tidak ada interaksi.
2. **Smart Bundling**: Astro hanya mengirimkan CSS dan aset yang benar-benar dipakai di halaman tersebut.
3. **Optimasi Gambar**: Astro punya komponen `<Image />` bawaan yang otomatis mengubah ukuran dan format gambar agar seringan mungkin.

## Apa Selanjutnya?

Dengan ini, kamu sudah menuntaskan **Bagian 1: Fondasi**. Kamu sudah paham kenapa Astro ada dan bagaimana ia bekerja.

Tapi teori tanpa praktik tidak ada gunanya. Di **Bagian 2: Membangun dengan Astro**, kita akan membangun project nyata dari nol, langkah demi langkah.

Sampai jumpa di Bagian 2.
