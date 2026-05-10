---
title: "Becoming Astron #13 — Dynamic Routes: Satu File, Seribu Halaman"
description: "Ingin membuat sistem blog atau katalog produk yang efisien? Mari belajar cara menggunakan Dynamic Routes di Astro untuk mengotomatisasi pembuatan halaman."
date: 11 May 2026
tags: ["astro", "tech"]
---

Sejauh ini, kita membuat halaman secara manual: satu file `.astro` untuk satu URL. Tapi bagaimana jika kita punya ratusan artikel blog? Membuat file secara manual tentu tidak masuk akal.

Di sinilah **Dynamic Routes** berperan. Kita bisa menggunakan "tanda kurung siku" `[]` pada nama file untuk memberitahu Astro: "Halaman ini punya bagian yang bisa berubah-ubah."

## Langkah 1: Membuat File dengan Parameter

Buatlah file di `src/pages/blog/[...id].astro`. 
Penggunaan `[...id]` (rest parameter) memungkinkan kita menangkap path yang lebih fleksibel, terutama saat menggunakan **Content Layer** di Astro versi terbaru.

## Langkah 2: Menggunakan `getStaticPaths()`

Karena Astro adalah framework statis secara default, ia perlu tahu di awal daftar halaman apa saja yang akan dibuat. Kita menggunakan fungsi sakti bernama `getStaticPaths()`.

```astro title="src/pages/blog/[...id].astro"
---
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map(post => ({
    params: { id: post.id },
    props: { post },
  }));
}

const { post } = Astro.props;
---
<h1>Postingan ID: {post.id}</h1>
```

Astro akan otomatis mencari semua konten di koleksi `blog` dan membuatkan halaman untuk masing-masing item berdasarkan `id`-nya.

## Menggabungkan dengan Data Nyata dan Rendering

Di Astro modern, kita menggunakan fungsi `render()` untuk mengubah konten Markdown menjadi komponen yang bisa ditampilkan.

```astro title="src/pages/blog/[...id].astro"
---
import { getCollection, render } from 'astro:content';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map(post => ({
    params: { id: post.id },
    props: { post },
  }));
}

const { post } = Astro.props;

// Fungsi render() mengubah konten (Markdown/MDX) menjadi komponen
const { Content } = await render(post);
---
<MainLayout title={post.data.title}>
  <h1>{post.data.title}</h1>
  <Content />
</MainLayout>
```

## Kenapa Ini Powerfull?

1. **Skalabilitas**: Tambah 1000 tulisan baru, kamu tidak perlu menambah 1000 file baru. Cukup satu template.
2. **Kecepatan Build**: Astro sangat efisien dalam memproses ribuan halaman sekaligus.
3. **Optimasi Otomatis**: Setiap halaman hasil generate tetap mendapatkan semua keuntungan Astro (Zero JS, Fast Loading).

## Mental Model
Bayangkan Dynamic Route sebagai sebuah **stempel**. Kamu punya satu stempel (file template), dan kamu punya banyak tinta/warna (data). Kamu tinggal menekankan stempel itu ke setiap data untuk membuat halaman baru.

Di tulisan berikutnya, kita akan kembali menyentuh sisi "hidup" dari web: **Island Architecture in Action**. Kita akan coba memasukkan komponen React ke dalam Astro kita!
