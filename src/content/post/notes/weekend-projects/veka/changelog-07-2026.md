---
title: "Veka Update: MDX, Navigasi Kolaps, Dark Mode & Rilis v1.0.0 - Weekend Projects"
description: Catatan pembaruan Veka, dari sekadar coretan digital garden menjadi template yang siap rilis. Navigasi kolaps, dukungan MDX, sistem tag, Pagefind, dan perjalanan menuju skor Lighthouse 100%.
date: 16 July 2026
tags: ["tech", "astro", "devlog", "digital-garden"]
---

##### tl;dr

- **MDX Support**: Menambahkan dukungan MDX ke content pipeline Astro, memperkaya konten dengan komponen interaktif di dalam Markdown.
- **Navigasi Kolaps & FileTree**: Sidebar kiri kini mendukung navigasi yang bisa dilipat (_collapsible_) dan komponen `FileTree` untuk menampilkan struktur folder wiki.
- **Sistem Tag & Discovery**: Halaman indeks tag, halaman dinamis per tag, growth stage di halaman tag, dan tautan "Browse tags" di footer.
- **Dark Mode & Tema**: Tombol _toggle_ dark mode di sidebar, palet warna "Ink & Umber", font Geist + Spectral, dan custom prose class.
- **Pagefind Search**: Integrasi pencarian Pagefind dengan komponen Dialog dari bejamas/ui.
- **Rilis v1.0.0 & CI/CD**: Template resmi terdaftar di [Astro Themes](https://astro.build/themes/veka), otomatisasi rilis dengan semantic-release, lisensi MIT, dan perbaikan bug untuk skor Lighthouse 100%.
- **Mobile UX**: Sidebar drawer mobile, page transitions, breadcrumbs, tombol download Markdown, dan TOC dengan IntersectionObserver.

---

Di [postingan sebelumnya](/blog/notes/weekend-projects/veka), aku cerita tentang lahirnya **Veka** — sebuah _digital garden_ minimalis yang kubangun di atas Astro karena nggak nemu template yang benar-benar pas. Saat itu, Veka masih berupa prototipe fungsional: navigasi otomatis, wiki-link ala Obsidian, dan Pagefind untuk search.

Nah, sembilan hari setelah artikel itu tayang, Veka udah berubah banyak. Dari sekadar coretan akhir pekan, sekarang udah resmi rilis `v1.0.0` dengan 30+ pull request, puluhan fitur baru, dan skor Lighthouse yang tembus 100% di semua metrik.

Dan yang paling bikin senyum: Veka sekarang udah resmi terdaftar di [**Astro Themes**](https://astro.build/themes/veka). Artinya, template ini bukan cuma proyek pribadi lagi — dia udah jadi bagian dari ekosistem Astro yang bisa ditemukan dan dipakai langsung oleh siapa pun.

Kalau mau lihat langsung semua perubahannya, cek repositorinya di sini:

::github{repo="masmuss/veka" label="Lihat Veka di GitHub"}

## MDX: Markdown yang Bisa Ngomong

Salah satu _upgrade_ paling signifikan di Veka adalah dukungan **MDX**. Sebelumnya, konten wiki cuma bisa berupa file `.md` biasa — statis, nggak bisa nyisipin komponen Astro di dalamnya.

Dengan MDX, sekarang setiap halaman wiki bisa berisi komponen interaktif:

- **FileTree**: Menampilkan struktur folder proyek langsung di dalam artikel, bukan sekadar _screenshot_.
- **Komponen kustom lain**: Misalnya embed YouTube, chart, atau apapun yang dibutuhkan.

Caranya simpel: ganti ekstensi file dari `.md` ke `.mdx`, lalu impor dan pakai komponen Astro seperti biasa di dalam konten. Nggak ada konfigurasi tambahan.

```d2
direction: right

FileMDX: File .mdx
AstroMDX: Astro MDX Integration
Plugins: Remark/Rehype Plugins
Components: Komponen Astro
HTMLOutput: HTML Output

FileMDX -> AstroMDX
AstroMDX -> Plugins
AstroMDX -> Components
Plugins -> HTMLOutput
Components -> HTMLOutput
```

## Navigasi yang Tahu Kapan Harus Diam

Di artikel awal, aku bangga banget sama navigasi sidebar yang tumbuh otomatis — tinggal lempar file ke folder, langsung muncul. Tapi ada satu masalah: untuk wiki dengan banyak subfolder, sidebar jadi panjang banget dan bikin _scrolling_ nggak nyaman.

Solusinya: **Collapsible Navigation**.

Sekarang setiap _parent folder_ di sidebar punya tombol panah kecil yang bisa diklik untuk melipat atau membuka daftar isinya. Nggak ada lagi sidebar yang panjangnya melebihi tinggi layar. Selain itu, aku juga nambahin:

- **Komponen FileTree**: Buat kamu yang mau nunjukin struktur file proyek di dalam konten artikel (bukan di sidebar), kini tersedia komponen `<FileTree />` yang tinggal dipanggil di `.mdx`.
- **Breadcrumbs**: Setiap halaman wiki sekarang punya jejak navigasi (_breadcrumb_) di bagian atas konten, jadi pembaca selalu tahu posisinya di dalam struktur wiki.

## Dark Mode, Palet Warna & Tipografi

Salah satu _feedback_ paling sering setelah artikel pertama tayang adalah soal tema gelap. Meskipun Veka udah mendukung dark mode via Tailwind, tombol untuk _toggle_-nya cuma ada di header global — kurang aksesibel buat pengguna yang lagi baca konten panjang di sidebar.

Sekarang aku nambahin **tombol toggle dark mode di sidebar kiri**, tepat di bawah judul situs. Tinggal sekali klik, tema langsung berubah.

Selain itu, ada pembaruan visual yang cukup besar:

- **Palet warna "Ink & Umber"**: Gradasi tinta dan tanah yang hangat — nggak menyilaukan di mode terang, tetap terbaca di mode gelap.
- **Font Spectral untuk heading**: Menggantikan font serif sebelumnya, Spectral punya karakter yang lebih tajam dan elegan untuk judul.
- **Font Geist & Geist Mono**: Untuk body text dan kode. Geist adalah font buatan Vercel yang bersih dan sangat terbaca di layar.
- **Custom prose class**: Awalnya pakai plugin `@tailwindcss/typography`, tapi banyak _override_ yang bikin konfigurasi makin ruwet. Sekarang Veka pakai kelas `custom-prose` yang ditulis manual — lebih ringan dan sepenuhnya bisa dikustomisasi.

## Highlighter Sintaks yang Paham Suasana

Veka sekarang pakai **Shiki** sebagai _syntax highlighter_, bukan Prism atau Highlight.js. Shiki melakukan _highlighting_ di _build time_, jadi nggak ada JavaScript tambahan di client-side.

Yang bikin Shiki istimewa di Veka adalah konfigurasi dual-theme:

- Tema terang: **One Light**
- Tema gelap: **One Dark**

Dan keduanya terpasang secara _class-based_, bukan _media-query_. Artinya, tema kode akan mengikuti preferensi tombol toggle dark mode, bukan preferensi sistem operasi. Ini penting banget buat pengguna yang suka gonta-ganti tema saat membaca.

## Sistem Tag: Dari Seedling ke Evergreen

Di artikel pertama, aku udah cerita soal skema _growth stage_ — `seedling`, `budding`, `evergreen` — yang bikin penulis bisa bebas nge-_publish_ tulisan setengah matang.

Sekarang sistem ini makin terintegrasi:

- **Halaman indeks tag**: `/tags` menampilkan semua tag yang ada di wiki beserta jumlah halamannya.
- **Halaman dinamis per tag**: Klik satu tag, dan kamu akan lihat semua halaman yang punya tag tersebut — lengkap dengan _growth stage_-nya masing-masing.
- **Tautan "Browse tags" di footer homepage**: Mempermudah eksplorasi konten berdasarkan topik.

Ini bikin Veka bukan cuma tempat nyimpen catatan, tapi juga alat buat menjelajah dan menemukan koneksi antar ide — sesuai banget sama filosofi _digital garden_.

## Search yang Semakin Mulus

Pencarian Pagefind yang udah ada sejak awal dapat peningkatan:

- **Integrasi dengan bejamas/ui Dialog**: Sebelumnya, hasil pencarian ditampilkan di elemen yang ditaruh manual. Sekarang pakai komponen `<Dialog>` yang lebih aksesibel — mendukung keyboard navigation, focus trap, dan animasi buka/tutup.
- **Shortcut `Cmd+K` tetap jalan setelah View Transition**: Ini sempet _bug_. Pas navigasi antar halaman pakai View Transition API-nya Astro, event listener keyboard untuk search kadang hilang. Udah diperbaiki dengan mekanisme re-binding di event `astro:after-swap`.
- **Dynamic import**: Pagefind sekarang diimpor secara dinamis, jadi nggak nambah beban _bundle_ di halaman yang nggak mengakses fitur search.

## Rilis v1.0.0 & CI/CD

Setelah sembilan hari iterasi tanpa henti, Veka akhirnya resmi rilis versi `v1.0.0`. Beberapa hal yang dibenahi jelang rilis:

- **Semantic-release**: Otomatisasi rilis dengan [semantic-release](https://semantic-release.org). Commit yang mengikuti konvensi [Conventional Commits](https://www.conventionalcommits.org/) akan otomatis menentukan versi rilis, menghasilkan changelog, dan mempublikasikan release di GitHub.
- **Lisensi MIT**: Veka sekarang resmi berlisensi MIT — bebas dipakai, dimodifikasi, dan didistribusikan.
- **Skor Lighthouse 100%**: Ini yang paling bikin puas. Setelah berkali-kali iterasi, akhirnya semua metrik Lighthouse — Performance, Accessibility, Best Practices, SEO — tembus 100. Beberapa perbaikan yang bikin ini terjadi:
  - Kontras warna teks (_muted-foreground_) disesuaikan agar lolos audit aksesibilitas.
  - `inert` attribute diterapkan di mobile nav drawer agar screen reader nggak baca konten di belakang drawer.
  - Font fallback stack eksplisit untuk heading agar nggak ada _layout shift_ saat font utama belum termuat.

## Peningkatan Mobile & UX

Beberapa fitur kecil tapi berdampak besar:

- **Mobile sidebar drawer**: Di layar kecil, sidebar kiri berubah jadi drawer yang bisa dibuka/tutup dengan tombol hamburger. Lengkap dengan animasi transisi halaman ala View Transition API.
- **Tombol download Markdown**: Setiap halaman wiki sekarang punya tombol untuk mengunduh kontennya dalam format `.md` mentah. Berguna banget buat yang pengen baca offline atau mengedit di Obsidian.
- **TOC dengan IntersectionObserver**: Table of Contents di sidebar kanan sekarang punya _active state_ — heading yang sedang kamu baca bakal di-_highlight_ secara otomatis.

---

Dari sekadar eksperimen akhir pekan, Veka sekarang udah jadi _template digital garden_ yang layak pakai — dan udah bisa langsung dipasang siapa aja cuma dalam 10 detik:

```bash
npx degit masmuss/veka my-digital-garden
cd my-digital-garden
pnpm install && pnpm run dev
```

Rencana berikutnya? Aku pengen eksplorasi beberapa arah:

- **Webmention & Fediverse integration**: Biar Veka bisa saling terhubung dengan _digital garden_ lain di web.
- **RSS/Atom feed otomatis**: Buat yang pengen berlangganan update dari sebuah wiki.
- **Auto-backlink visualization**: Menampilkan grafik koneksi antar catatan — semacam _graph view_ ala Obsidian tapi di web.

Tapi untuk sekarang, aku mau nikmatin dulu fakta bahwa proyek iseng akhir pekan ini udah mencapai titik di mana orang lain bisa langsung pakai. Nggak ada yang lebih memuaskan dari itu.

Sampai jumpa di catatan berikutnya. _Selamat ngerajut pikiran!_ 🌱
