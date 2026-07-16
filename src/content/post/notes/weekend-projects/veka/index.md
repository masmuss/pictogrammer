---
title: Kenapa aku bikin Veka - Weekend Projects
description: Kadang, kita tidak butuh framework dokumentasi berskala enterprise. Kita hanya butuh tempat sepi untuk merajut isi kepala. Inilah cerita akhir pekan di balik lahirnya Veka
date: 07 July 2026
coverImage:
  src: ../../../../../assets/images/projects/veka/thumbnail.png
  alt: Thumbnail Veka
tags: ["tech", "astro", "devlog", "digital-garden"]
---

Akhir pekan lalu, aku cuma duduk diam natap layar editor yang kosong. Ada beberapa ide arsitektur sistem dan _snippet_ kode yang pengen banget aku dokumentasiin biar nggak nguap gitu aja.

Insting pertamaku sebagai _developer_ di ekosistem Astro jelas langsung tertuju ke [**Starlight**](https://starlight.astro.build/id/).

Tapi, setelah lima belas menit ngutak-ngatik konfigurasi rute di `astro.config.mjs` dan ngeliat tumpukan komponen bawaan yang di-_generate_, aku stop ngetik. Rasanya ada yang salah. Pakai Starlight cuma buat nyimpen coretan pikiran tuh ibarat nyewa kontainer cuma buat mindahin sekardus buku catatan.

Itu _overkill_. Terlalu berisik. Terlalu banyak aturan buat sesuatu yang sifatnya organik.

Aku kan nggak lagi nulis dokumentasi resmi buat API publik. Aku cuma nyari tempat buat **mikir**. Sebuah _digital garden_.

Karena nggak nemu _template_ yang benar-benar pas—yang nggak penuh sama _bloatware_ UI atau _runtime_ JavaScript yang berat—akhirnya akhir pekan kemarin aku abisin buat ngebangun sendiri.

Aku kasih nama **Veka**.

Lihat Demo-nya di [Veka](https://demo-veka.khoirul.me)

Dan lihat kodenya di

::github{repo="masmuss/veka" label="Lihat Veka di GitHub"}

## Ngebongkar Kompleksitas

Pas ngebangun Veka, aku nerapin satu aturan main yang lumayan ekstrem: **buang semua hal yang bikin ribet pas nulis.**

Kalo ada fitur yang bikin waktu _build_ melambat atau nambah ukuran _bundle_ di _client-side_ tanpa alasan yang jelas, fitur itu wajib dibuang. Hasilnya adalah sebuah anomali di tengah tren _web development_ modern:

1. **Navigasi yang Tumbuh Sendiri** Di Veka, aku nolak keras konsep mendaftarkan rute _sidebar_ secara manual. Pikiran manusia itu lompat dari satu ide ke ide lain. Jadi, Veka aku rancang buat mindai sub-folder sedalam apa pun secara otomatis. Tinggal lempar file `.md` ke folder `arsitektur/go/`, dan navigasinya bakal langsung jadi saat itu juga.

2. **Bawa Kebiasaan Obsidian ke Web** Sebagai orang yang terbiasa pakai metode _Zettelkasten_, nulis tautan Markdown klasik kaya `[gini](/url-panjang)` tuh rasanya ngehambat mikir banget. Akhirnya aku nyempetin nulis _parser_ kustom biar aku bisa sekadar ngetik `[[Docker Best Practices]]`, dan sistem bakal ngerajut tautan dua-arah (_bi-directional_) secara otomatis pas _build_.

3. **Search Tanpa Pihak Ketiga** Aku males banget harus ngurus API [Algolia](https://www.algolia.com/) cuma buat fitur _search_ di web statisku sendiri. Makanya, Veka pakai **Pagefind**. Mesin pencari ini ngindeks file statis secara lokal pas perintah `build` jalan. Nggak ada _server_ tambahan, nggak ada _delay_.

## Ide Sebagai Makhluk Hidup

Satu hal yang bikin _digital garden_ beda banget sama blog biasa adalah soal ekspektasi. Blog nuntut tulisan yang udah rapi dan dipoles. _Digital garden_ merayakan sebuah proses.

Buat ngedukung konsep ini, aku ngunci skema (pakai [Zod](https://zod.dev/)) yang maksa setiap catatan di Veka punya fase pertumbuhannya sendiri:

- `seedling` buat ide mentah atau sekadar _copy-paste_ kasar.
- `budding` buat catatan yang lagi pelan-pelan aku lengkapi.
- `evergreen` buat panduan utuh yang udah matang.

Fitur kecil ini ngasih kebebasan mental yang luar biasa. Aku bisa santai nge-_publish_ tulisan setengah matang tanpa merasa bersalah, karena pembaca udah dikasih tau dari awal kalo tulisan itu statusnya "masih tumbuh".

## Sebuah Undangan

Veka ini bukan saingannya Starlight atau framework raksasa lainnya. Keduanya hidup di dimensi yang beda. Veka adalah antitesis dari kerumitan. Cuma sebuah ruang sunyi berbalut desain minimalis dengan skor Lighthouse rata-rata 100%.

Kalo kamu mulai capek sama _tooling_ yang ngalangin produktivitas, dan cuma pengen punya "otak kedua" yang ringan, super cepat, dan sepenuhnya ada di bawah kendalimu, kamu bisa _clone_ _workspace_ ini.

Cuma butuh sepuluh detik:

```bash
npx degit masmuss/veka my-digital-garden
cd my-digital-garden
pnpm install && pnpm run dev
```

Kadang, penemuan paling asyik di akhir pekan itu bukan soal seberapa banyak teknologi canggih yang bisa kita tumpuk di satu repositori, tapi soal seberapa banyak kerumitan yang berani kita buang.

Selamat ngerajut pikiran. 🌱
