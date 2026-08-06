---
title: "Becoming Astron #15 — Data Fetching: Menghubungkan Website ke Dunia Luar"
description: "Sebuah website konten seringkali butuh data dari API eksternal. Mari belajar bagaimana Astro mengambil data dengan sangat efisien menggunakan Top-level Await."
date: 13 May 2026
tags: ["astro", "tech"]
---

Salah satu ketakutan developer saat pindah ke framework baru adalah: "Bagaimana cara saya ambil data dari API?". Di framework lain, ini seringkali rumit. Kamu harus mikir soal `useEffect`, `loading state`, dan `error handling` di sisi client.

Di Astro, kamu akan kaget betapa sederhananya ini.

## Rahasia Astro: Top-level Await

Ingat bagian "Frontmatter" (pagar `---`) yang kita bahas sebelumnya? Di sana, kamu bisa menggunakan `await` secara langsung. Kamu tidak perlu membungkusnya dalam fungsi `async`.

```astro title="src/pages/users.astro"
---
const response = await fetch("https://jsonplaceholder.typicode.com/users");
const users = await response.json();
---

<h1>Daftar Pengguna</h1>
<ul>
	{
		users.map((user) => (
			<li>
				{user.name} - {user.email}
			</li>
		))
	}
</ul>
```

## Kenapa Ini Lebih Baik?

1. **Keamanan**: Jika kamu butuh mengambil data dari database menggunakan API Key yang rahasia, kamu bisa melakukannya di sini dengan aman. API Key tersebut tidak akan pernah bocor ke browser user.
2. **Tanpa Loading State**: Karena data diambil saat **build time** (atau saat request di server), user menerima HTML yang sudah jadi. Tidak ada lagi animasi "spinner" yang mengganggu saat halaman pertama kali dibuka.
3. **Performa**: Browser tidak perlu melakukan request HTTP tambahan setelah halaman dimuat. Semuanya sudah siap saji.

## SSR vs Static

Secara default, `fetch` di Astro berjalan saat kamu menjalankan perintah `build`. Hasilnya akan menjadi file HTML statis.

Namun, jika website kamu butuh data yang selalu berubah setiap detik (seperti harga saham atau skor bola), kamu bisa mengubah mode Astro menjadi **Server-side Rendering (SSR)** di file konfigurasi.

## Tips Astron

Gunakan `try/catch` di dalam frontmatter untuk menangani jika API yang kamu panggil sedang error. Kamu bisa menampilkan pesan error yang ramah atau bahkan membatalkan build jika data tersebut sangat krusial.

Akhirnya, kita sampai di langkah terakhir perjalanan kita. Di tulisan penutup besok, kita akan membahas **Deployment**: meluncurkan karya kita ke internet!
