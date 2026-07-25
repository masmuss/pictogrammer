---
title: "Becoming Astron #16 — Deployment: Meluncurkan Pesawat ke internet"
description: "Setelah perjalanan panjang dari nol, saatnya kita menunjukkan karya kita kepada dunia. Mari belajar berbagai cara meluncurkan project Astro ke internet secara rinci."
date: 14 May 2026
tags: ["astro", "tech"]
---

Selamat! Kamu telah sampai di tujuan akhir dari seri **Becoming Astron**. Kamu sudah belajar filosofi, struktur, styling, routing, hingga interaksi. Tapi, website yang hebat tidak akan ada gunanya jika hanya mendekam di komputermu sendiri.

Saatnya kita meluncurkan pesawat kita ke orbit internet.

## Langkah 1: Persiapan Produksi

Sebelum dideploy, kita harus memastikan kode kita siap untuk produksi. Jalankan perintah:

```bash
npm run build
```

Astro akan melakukan optimasi besar-besaran: memperkecil ukuran CSS, mengoptimalkan gambar melalui komponen `<Image />`, dan menghasilkan file HTML statis yang bersih di folder `dist/`.

## Langkah 2: Memilih "Pangkalan Udara" (Platform Deployment)

Astro sangat fleksibel. Karena output utamanya adalah file statis, ia bisa dideploy hampir di mana saja. Berikut adalah beberapa pilihan populer:

### 1. Vercel & Netlify (Paling Populer)

Keduanya menawarkan integrasi GitHub yang sangat mulus. Kamu cukup hubungkan repo-mu, dan setiap kali kamu `git push`, website otomatis terupdate.

- **Kelebihan**: Sangat mudah, fitur _Preview Deployments_ (melihat hasil sebelum merge), dan gratis untuk project personal.

### 2. Cloudflare Workers (Performa Tinggi di Edge)

Astro sekarang memiliki dukungan luar biasa untuk **Cloudflare Workers**. Jika kamu ingin website yang sangat cepat karena dijalankan di ribuan lokasi server Cloudflare di seluruh dunia, ini pilihannya.

Jika kamu menggunakan fitur SSR (Server-side Rendering), kamu perlu menambahkan adapter:

```bash
npx astro add cloudflare
```

Setelah itu, kamu bisa mendeploy menggunakan CLI **Wrangler**:

```bash
npx wrangler deploy
```

### 3. GitHub Pages

Cocok untuk project open source atau website pribadi yang sepenuhnya statis. Gratis selamanya dan terintegrasi langsung dengan GitHub Actions.

## Langkah 3: Static vs SSR (Server-Side Rendering)

- **Static (Default)**: Website kamu dibangun sekali saat build, lalu file `.html` dikirim ke server. Sangat cepat dan murah.
- **SSR**: Website dibangun di server setiap kali ada user yang mengakses. Berguna jika data kamu sangat dinamis (seperti sistem login). Untuk ini, kamu **wajib** menggunakan adapter sesuai platform pilihanmu (misal: `@astrojs/vercel`, `@astrojs/netlify`, atau `@astrojs/cloudflare`).

## Langkah 4: Otomatisasi dengan CI/CD

Cara terbaik untuk mendeploy adalah dengan tidak mendeploy secara manual.

1. Hubungkan repo GitHub ke platform pilihanmu.
2. Setiap kali ada perubahan di branch `main`, platform tersebut akan menjalankan `npm run build`.
3. Jika build sukses, website otomatis _live_.

:::tip
Pastikan kamu selalu mengecek hasil build secara lokal dengan `npm run preview` sebelum melakukan push ke GitHub untuk memastikan tidak ada error yang terlewat.
:::

## Penutup

Menjadi Astron bukan tentang meninggalkan semua framework lain. Ini tentang punya pilihan.

Sekarang, setiap kali kamu ingin membangun website, ada pertanyaan yang bisa kamu tanyakan dulu: apakah ini benar-benar butuh JavaScript di semua bagian? Bisakah konten jadi prioritas utama?

Astro tidak membuat segalanya lebih canggih. Ia hanya membuat segalanya lebih ringan — dan kadang, itu yang kita butuhkan.

Terima kasih sudah mengikuti seri Becoming Astron dari #1 sampai #16. Sampai jumpa di project-project berikutnya.
