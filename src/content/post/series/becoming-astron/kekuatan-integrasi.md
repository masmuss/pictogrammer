---
title: "Becoming Astron #17 — Kekuatan Integrasi: Memperluas Superpower Astro"
description: "Astro sangat hebat sendirian, tapi dengan integrasi, ia menjadi tak terkalahkan. Mari bahas ekosistem integrasi Astro yang mempermudah hidup kita."
date: 15 May 2026
tags: ["astro", "tech"]
---

Salah satu alasan kenapa Astro begitu dicintai oleh developer bukan hanya karena kecepatannya, tapi karena **ekosistemnya yang sangat membantu**. 

Astro dirancang agar bersifat *extensible* (bisa diperluas). Jika Astro dasar adalah sebuah ponsel baru, maka integrasi adalah aplikasi-aplikasi hebat yang membuatnya jauh lebih berguna.

## Apa Itu Integrasi Astro?

Integrasi adalah paket kode yang bisa kamu tambahkan ke project Astro hanya dengan satu perintah. Ia bisa melakukan banyak hal otomatis, mulai dari menambahkan framework UI, mengelola SEO, hingga mengoptimalkan gambar.

Astro membagi integrasi menjadi dua kategori:
1. **Official**: Dikelola langsung oleh tim Astro (biasanya diawali dengan `@astrojs/`).
2. **Community**: Dibuat oleh komunitas pengembang di seluruh dunia.

## Daftar Integrasi Wajib Tahu

Mari kita bahas beberapa yang paling sering digunakan, fungsinya, dan bagaimana mereka mengubah cara kita bekerja.

### 1. Tailwind CSS (`@astrojs/tailwind`)
*   **Fungsi**: Memungkinkanmu menggunakan class utilitas Tailwind langsung di komponen Astro.
*   **Before**: Kamu harus install manual, buat file `tailwind.config.mjs`, import file CSS global, dan memastikan PostCSS berjalan benar.
*   **After**: Cukup jalankan `npx astro add tailwind`. Semuanya beres!
*   **Implementasi**: 
    ```bash
    npx astro add tailwind
    ```

### 2. MDX (`@astrojs/mdx`)
*   **Fungsi**: Memungkinkanmu menulis komponen (seperti React atau Svelte) langsung di dalam file Markdown.
*   **Before**: Kamu hanya bisa menulis teks statis dan gambar biasa di file `.md`.
*   **After**: Kamu bisa membuat grafik interaktif, tombol, atau form di tengah-tengah artikel blog.
*   **Implementasi**:
    ```bash
    npx astro add mdx
    ```

### 3. Sitemap (`@astrojs/sitemap`)
*   **Fungsi**: Otomatis membuat file `sitemap-index.xml` setiap kali kamu melakukan build.
*   **Before**: Kamu harus mencari generator sitemap pihak ketiga atau menulisnya manual setiap kali ada postingan baru agar Google bisa mengindeks webmu.
*   **After**: Astro akan memindai semua rute kamu dan membuat sitemap yang valid secara otomatis.
*   **Implementasi**:
    ```bash
    npx astro add sitemap
    ```

### 4. Astro Icon (`astro-icon` - Community)
*   **Fungsi**: Menggunakan ribuan icon dari berbagai library (seperti Lucide, FontAwesome, RI) dengan sangat ringan.
*   **Before**: Kamu harus download file SVG, simpan di folder public, atau install library icon yang berat.
*   **After**: Kamu cukup panggil nama icon-nya, dan Astro hanya akan mengirimkan kode SVG yang dipakai saja.
*   **Implementasi**:
    ```bash
    bun add astro-icon
    ```
    ```astro
    import { Icon } from 'astro-icon/components'
    <Icon name="ri:github-fill" />
    ```

### 5. Shiki JS (Built-in Syntax Highlighter)
*   **Fungsi**: Memberikan pewarnaan kode (*syntax highlighting*) yang indah dan akurat pada blok kode di Markdown.
*   **Keunggulan**: Shiki menggunakan engine yang sama dengan VS Code, sehingga warna kodenya terlihat sangat profesional. Ia juga bekerja di sisi server, jadi tidak ada beban JavaScript tambahan untuk pembaca.
*   **Implementasi**: Sudah terpasang secara default! Kamu hanya perlu mengaturnya di file konfigurasi jika ingin mengganti tema.

### 6. Cloudflare & Vercel Adapters (`@astrojs/cloudflare` & `@astrojs/vercel`)
*   **Fungsi**: Memungkinkan website Astro kamu memiliki fitur dinamis (SSR) dan berjalan di infrastruktur spesifik penyedia hosting tersebut.
*   **Kegunaan**: Tanpa adapter, Astro hanya menghasilkan file statis. Dengan adapter, kamu bisa memiliki sistem login, akses database real-time, atau menjalankan kode di "Edge" (dekat dengan lokasi user).
*   **Implementasi**: 
    ```bash
    npx astro add cloudflare # Untuk Cloudflare
    npx astro add vercel     # Untuk Vercel
    ```

### 7. Starlight (`@astrojs/starlight`)
*   **Fungsi**: Integrasi khusus (sebenarnya sebuah template/framework di atas Astro) untuk membuat website dokumentasi yang profesional dalam hitungan menit.
*   **Fitur**: Sudah termasuk pencarian (*site search*), navigasi sidebar, mode gelap, hingga internasionalisasi (multi-bahasa).
*   **Implementasi**: Biasanya dimulai saat membuat project baru, tapi bisa juga ditambahkan ke project yang sudah ada.
    ```bash
    npm create astro@latest -- --template starlight
    ```

### 8. Sentry (`@sentry/astro`)
*   **Fungsi**: Memantau error dan performa website kamu secara real-time.
*   **Before**: Kamu harus memasang script tracking manual dan mengatur *source maps* agar pesan error-nya bisa dibaca (tidak ter-minify).
*   **After**: Sentry otomatis menangkap setiap error yang dialami user dan memberitahumu bagian mana dari kodemu yang bermasalah.
*   **Implementasi**:
    ```bash
    npx astro add @sentry/astro
    ```

## Di Balik Layar: `astro.config.ts`

Semua integrasi yang kamu tambahkan akan bermuara di satu file sakti: `astro.config.ts` (atau `.mjs`). Ini adalah pusat kendali dari website Astro kamu.

Di file ini, kamu bisa mengatur opsi spesifik untuk setiap integrasi. Sebagai contoh, perhatikan bagaimana kita mengatur Shiki dan integrasi lainnya:

```typescript title="astro.config.ts"
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  markdown: {
    shikiConfig: {
      theme: 'dracula-soft', // Tema pewarnaan kode
      wrap: true,            // Agar kode panjang turun ke baris baru
    },
  },
  integrations: [
    mdx(),
    sitemap(),
  ],
  vite: {
    plugins: [tailwindcss()],
  }
});
```

Kadang, integrasi membutuhkan pengaturan lebih dalam (seperti menambahkan plugin Remark/Rehype untuk Markdown). Dengan memahami isi file ini, kamu punya kendali penuh atas bagaimana website kamu berperilaku.

## Keajaiban Perintah `astro add`

Astro memiliki tool CLI yang sangat cerdas. Dulu, kita harus mengedit file `astro.config.mjs` secara manual setiap kali menambah fitur. Sekarang, perintah `astro add` akan:
1. Menginstall dependency yang dibutuhkan.
2. Memperbarui file konfigurasi secara otomatis.
3. Menambahkan boilerplate kode jika diperlukan.

Ini adalah lompatan besar dalam *Developer Experience*.

## Kesimpulan

Integrasi adalah cara Astro bilang: *"Kami ingin kamu fokus pada ide, bukan pada konfigurasi."* 

Jangan ragu untuk menjelajahi [Astro Integrations Directory](https://astro.build/integrations/) untuk menemukan ribuan tool lain yang bisa mempercepat proses pembuatan website kamu.

Ini adalah bonus tulisan untuk melengkapi perjalananmu. Sekarang, kamu benar-benar punya semua senjata untuk membangun website masa depan!

**Keep building, Astron!** 🚀
