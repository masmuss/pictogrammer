---
title: "Becoming Astron #6 — Island Architecture: Kapan Perlu, Kapan Tidak"
description: "Island Architecture terdengar rumit, tapi idenya sederhana: hidupkan hanya bagian yang perlu. Di tulisan ini, kita bahas kapan island dibutuhkan, dan kapan justru berlebihan."
date: 8 January 2026
tags: ["astro", "tech"]
---

Island Architecture sering terdengar seperti konsep besar. Padahal, idenya sangat dekat dengan kehidupan sehari-hari.

Bayangkan sebuah halaman website itu seperti **koran**. Sebagian besar isinya:

- teks
- gambar
- dibaca, lalu selesai

Tapi kadang ada satu bagian kecil:

- form komentar
- tombol like
- dropdown interaktif

Pertanyaannya: **apakah seluruh koran harus “hidup” hanya karena satu bagian kecil itu?**

Astro menjawab: tidak perlu.

## Apa Itu Island Architecture (Versi Manusia Normal)

Island Architecture di Astro artinya:

- sebagian besar halaman tetap statis
- hanya bagian tertentu yang interaktif
- JavaScript dikirim hanya ke bagian itu

Seperti:

- rumah besar
- hanya satu ruangan yang dipakai
- lampu menyala di ruangan itu saja

Sederhana, masuk akal.

## Kapan Kamu Perlu Island?

Kamu perlu Island ketika:

- ada interaksi nyata (klik, input, toggle)
- ada state yang berubah
- HTML dan CSS saja tidak cukup

Contohnya:

- search box
- form validasi
- carousel interaktif

Kalau tidak ada itu, island belum tentu diperlukan.

## Kapan Island Tidak Diperlukan?

Ini bagian yang sering dilewatkan.

Kamu tidak perlu Island untuk:

- menampilkan data statis
- layout
- navigasi sederhana
- konten yang hanya dibaca

Memaksa Island di semua tempat itu seperti membawa payung saat cuaca cerah, mungkin berguna, tapi tidak perlu.

## Cara Astro Menghidupkan Island

Astro memberi beberapa cara untuk “menghidupkan” island:

- saat halaman dibuka
- saat komponen terlihat
- saat browser sedang santai

Ini seperti: kamu tidak bangunin orang yang masih tidur, kamu tunggu sampai benar-benar dibutuhkan. Lebih hemat tenaga, lebih cepat terasa.

## Island Bukan Kewajiban, Tapi Pilihan

Yang paling penting Island Architecture di Astro **bukan aturan keras**.

Kamu tidak akan dihukum jika:

- satu halaman tanpa island
- website tanpa JavaScript sama sekali

Astro tetap bekerja dengan baik.

Island Architecture bukan tentang kecanggihan. Ia tentang proporsi.

Tidak semua bagian website perlu interaksi. Tidak semua masalah perlu JavaScript.

Dan Astro memberi kita kebebasan untuk menentukan itu—tanpa rasa bersalah.

Dengan ini, **Bagian 1: Fondasi** dari series _Becoming Astron_ masih berlanjut. Kita sudah paham "Kenapa" Astro ada, sekarang kita akan mulai masuk ke "Bagaimana" ia bekerja secara fundamental.

Di bagian selanjutnya, kita akan membedah **Komponen Astro dan Keajaiban Frontmatter**. Sampai jumpa di sana!
