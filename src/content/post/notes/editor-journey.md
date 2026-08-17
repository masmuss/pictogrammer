---
title: Zed Itu Cepat, Tapi Bukan Itu Alasannya
description: "Catatan perjalanan pindah editor: dari extension-driven VSCode, ke power-heavy JetBrains, sampai akhirnya stay di Zed."
date: 17 August 2026
tags: ["tech", "devlog", "tools"]
---

Aku pernah nunggu tiga menit buat indexing sebelum bisa nulis satu baris kode. Itu yang bikin aku pindah editor — untuk ketiga kalinya.

Tapi sebelum sampai ke Zed, aku bahkan mulai dari editor yang jauh lebih tua, CodeVision AVR.

## CodeVision AVR: Awal yang Tidak Disangka

Sebelum kenal VSCode, sebelum tahu apa itu JavaScript, editor pertamaku adalah **CodeVision AVR**.

Tahun 2018-2020. Aku bergabung dengan ekskul robotika, dan bahasa yang dipakai bukan Python atau JavaScript — tapi **C**, untuk pemrograman microchip Atmega. CodeVision AVR adalah IDE-nya: kuno, jadul, tapi fungsional. Di sinilah aku pertama kali paham konsep dasar: tulis kode, compile, flash ke hardware, lihat hasilnya.

Tidak ada autocomplete yang canggih. Tidak ada tema gelap yang cantik.

## VSCode: Era Extension

Awal 2020, saat pandemi mulai bikin semua orang di rumah, dan aku memutuskan untuk belajar web development: HTML, CSS, JavaScript, PHP. Dan editor yang dipakai semua tutorial waktu itu cuma satu: **VSCode**.

Alasanku betah waktu itu simpel: ringan, gratis, open source, dan ekstensinya banyak banget. Untuk proyek kecil, VSCode terasa sempurna. Beberapa ekstensi yang kupasang dari dulu sampai sekarang:

- **Auto Rename Tag** — nggak perlu rename tag pembuka dan penutup dua kali
- **Babel JavaScript** — syntax highlighting yang lebih baik
- **PHP Intelephense** — autocomplete PHP yang solid
- **ESLint** — biar kode JS tetap rapi
- **Live Server** — hot reload untuk frontend tanpa setup apa-apa

Lima ekstensi itu nemenin aku dari belajar HTML pertama kali sampai proyek-proyek freelance pertama.

Tapi setelah codebase mulai membesar, VSCode mulai terasa beda. VSCode — yang dulu terasa ringan — mulai berat. Apalagi karena aku sering pindah-pindah bahasa: PHP di satu proyek, JavaScript di proyek lain, Python di proyek berikutnya. Setiap proyek punya kombinasi ekstensi sendiri. Lama-lama urusan setup mulai terasa lebih ribet daripada yang seharusnya.

## JetBrains: Era Power

Dari VSCode, aku loncat ke ekosistem JetBrains. Dan bukan cuma satu IDE — hampir semuanya pernah kupakai:

**WebStorm** untuk frontend, **PHPStorm** untuk backend Laravel, **GoLand** untuk Go, **DataGrip** untuk database, **PyCharm** untuk Python, **IntelliJ** untuk Java, **Rider** untuk C#. Masing-masing punya spesialisasinya sendiri.

Alasan utamanya sederhana: JetBrains lebih ngerti teknologi yang kupakai. Yang paling kerasa buatku waktu pakai PHPStorm adalah Laravel. Fitur kayak route autocomplete, blade template intelligence, dependency injection resolution — di VSCode, hal-hal seperti ini biasanya berarti nambah extension dan konfigurasi lagi.

Yang paling kusuka dari JetBrains: rekomendasi refactoring, debugging, testing, dan completion yang mostly langsung konteks codebase-ku. Rasanya beda dari sekadar autocomplete. IDE-nya memang lebih ngerti isi proyek.

Soal lisensi nggak masalah — GitHub Student Pack include semua JetBrains apps. Gratis selama masih mahasiswa.

Tapi ada harganya. **Berat.** Boros memori. Semua JetBrains IDE dibangun di atas JVM, dan load proyek besar sering bikin nunggu. Buat monorepo dengan 3 aplikasi di dalamnya, indexing bisa makan waktu sekitar 3 menit. Jadi rutinitasku kadang simpel: buka laptop, buka IDE, lalu nunggu. Dan itu kejadian hampir setiap hari.

Mungkin itu yang akhirnya bikin aku makin peduli sama hal-hal kecil: seberapa cepat file kebua, seberapa responsif kursor, dan seberapa jarang editor nge-freeze.

## Zed: Tempat Berlabuh

Zed kukenal sejak jaman beta test. Ya — aku salah satu beta tester-nya.

Awalnya cuma iseng. Tapi akhirnya ada tiga hal yang bikin aku tetap pakai Zed:

1. **Ringan.** Zed ditulis di Rust, bukan Electron, bukan JVM. Begitu dibuka, bedanya langsung terasa.
2. **Minimal.** Interface-nya jauh lebih sederhana. Sidebar, notifikasi, dan hal-hal lain yang jarang kupakai bisa disingkirkan.
3. **Multi-buffer.** Ini fitur yang paling kusuka. Beberapa file bisa kubuka bersamaan dalam satu tampilan, jadi aku bisa pindah-pindah dan mengeditnya tanpa harus mengatur banyak tab dan split pane.

Fitur yang sekarang paling sering kupakai? Ya mostly sama kayak IDE sebelumnya: buka file, edit, cari, git. Bedanya, semuanya terasa jauh lebih responsif. Akhir-akhir ini juga lagi eksperimen sama AI integration di Zed — masih penasaran mau lihat sejauh apa bisa diandalkan.

Yang masih kukangen dari JetBrains cuma satu: integrasi sama teknologi yang lebih matang terutama Laravel. Zed masih fase awal — ekosistemnya juga belum sebesar VSCode atau JetBrains, jadi kadang masih ada hal yang harus kuakalin sendiri.

### Setup Sekilas

- **Keymap VSCode** — puluhan tahun muscle memory, tidak mungkin kubuang. Tapi vim mode juga aktif, buat navigasi cepat antar buffer.
- **Tab bar dimatikan** — lebih minimal. Project panel di kanan, outline di kiri.
- **MCP context servers** — ini yang menutup celah "kangen integrasi JetBrains": `laravel-boost` untuk Laravel via artisan, plus MCP untuk dokumentasi Astro dan shadcn. Jadi integrasi framework tetap ada — cuma lewat jalur yang lebih ringan.
- **Agent setup** — commit message pakai conventional commits, beberapa perintah terminal di-allow otomatis (git, artisan, grep, ls), sisanya tetap minta konfirmasi.
- **Biome sebagai formatter** untuk TypeScript dan JavaScript — konsisten sama setup proyek-proyekku.
- **Theme Lumin, font SpaceMono** — subjektif, tapi nulis kode di font yang enak dilihat itu setengah dari kenyamanan.

## Editor Lain yang Sempat Kusentuh

Selain tiga editor utama, aku juga sempat nyobain beberapa editor lain: **Sublime**, **Atom** (sebelum ditutup), **Vim**, sampai yang lagi rame sekarang: **Cursor**, **Windsurf**, **Trae**, **Antigravity**.

Sebagian cuma kucoba karena penasaran, terutama yang lagi ramai. Tapi nggak ada yang bikin aku pindah. Setelah beberapa kali pindah editor, aku mulai tahu apa yang sebenarnya kucari.

## Penutup

Delapan tahun, tiga editor utama. Kalau ditanya mana yang terbaik, aku juga nggak tahu. Tiap fase ternyata butuh editor yang beda. VSCode pas waktu belajar, JetBrains pas kerjaan mulai serius, Zed pas sadar bahwa kecepatan itu fitur.

Buat sekarang, aku nyaman di Zed. Tapi jujur, kalau nanti ada yang lebih baik, bisa jadi aku pindah lagi. Zed masih fase awal dan ekosistemnya masih berkembang. Dan buatku, itu nggak masalah.
