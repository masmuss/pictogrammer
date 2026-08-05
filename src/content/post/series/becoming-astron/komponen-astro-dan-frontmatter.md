---
title: "Becoming Astron #7 — Komponen Astro dan Keajaiban Frontmatter"
description: "Di Astro, komponen bukan cuma soal UI, tapi soal bagaimana kita mengelola data dengan tenang. Mari mengenal blok pagar (frontmatter) dan siklus hidup komponen Astro."
date: 9 January 2026
tags: ["astro", "tech"]
---

Setelah tahu cara memulai project, sekarang kita masuk ke "jantung" dari Astro: **file `.astro`**.

Kalau kamu datang dari dunia React atau Vue, file ini mungkin terlihat familiar tapi terasa berbeda. Mari kita bedah kenapa file ini spesial.

```astro title="src/components/Halo.astro"
---
// 1. Bagian Script (Frontmatter)
// Kode JavaScript/TypeScript di sini hanya jalan di SERVER.
// Cocok untuk: ambil data, akses database, kelola variabel.
---

<!-- 2. Bagian Template (HTML) -->
<!-- Struktur website kamu ada di sini. -->
<!-- Astro akan menggabungkan logika di atas ke dalam HTML ini. -->
```

_Struktur Komponen Astro: Pemisahan tegas antara Logika (Server) dan Tampilan (HTML)._

## Struktur Komponen Astro

Satu file `.astro` biasanya terbagi menjadi dua bagian besar yang dipisahkan oleh "pagar" (code fence):

```astro
---
// 1. Bagian Script (Frontmatter)
// Semua kode di sini jalan di SERVER saat build time.
const name = "Astron";
---

<!-- 2. Bagian Template -->
<!-- Ini adalah HTML biasa dengan sedikit superpower -->
<h1>Halo, {name}!</h1>
```

## Keajaiban Frontmatter: Data Fetching Tanpa Drama

Di framework lain, mengambil data dari API seringkali butuh ritual: `useEffect`, `useState`, atau fungsi khusus. Di Astro, kamu cukup melakukannya di dalam frontmatter.

```astro title="src/pages/posts.astro"
---
const response = await fetch('https://jsonplaceholder.typicode.com/posts');
const posts = await response.json();
---

<ul>
  {posts.map(post => <li>{post.title}</li>)}
</ul>
```

**Kenapa ini keren?**
Karena `await` bisa langsung dipakai di tingkat atas (top-level). Tidak perlu membungkusnya dalam fungsi `async`. Semuanya terasa linear dan mudah dibaca.

## Siklus Hidup: Hanya Server, Selamanya

Ini adalah _mental model_ paling penting: **Kode di dalam frontmatter TIDAK PERNAH dikirim ke browser.**

- Kamu bisa menulis rahasia API (API Keys) di sini dengan aman.
- Kamu bisa akses database langsung dari sini.
- `console.log` di sini akan muncul di terminalmu, bukan di _inspect element_ browser.

:::note
Jika kamu butuh kode yang jalan di browser (seperti `window.alert`), kamu harus menuliskannya di dalam tag `<script>` di bagian template, bukan di frontmatter.
:::

## Kenapa Ini Membebaskan?

Dengan memindahkan logika ke server (saat build), browser user tidak perlu memproses JavaScript yang berat hanya untuk menampilkan daftar tulisan. User menerima HTML bersih, dan kamu sebagai developer tetap bisa menikmati kemudahan menulis logika modern.

Di tulisan berikutnya, kita akan melihat bagaimana Astro memperlakukan konten (Markdown) sebagai "warga kelas satu".

:::tip
Ingat: Frontmatter adalah tempatmu menyiapkan segalanya sebelum "surat" dikirim ke pembaca.
:::
