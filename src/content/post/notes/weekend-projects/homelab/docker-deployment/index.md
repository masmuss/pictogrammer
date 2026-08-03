---
title: "Orchestration Laravel Octane via Cloudflare Tunnel - Weekend Projects"
description: Catatan teknis tentang pengalamanku mengorkestrasi Laravel Octane dengan Cloudflare Tunnel untuk deployment yang lebih aman dan praktis.
date: 25 April 2026
tags: ["tech", "homelab", "devlog", "docker"]
---

**tl;dr**

- Deploy applyst dengan Laravel Octane terasa jauh lebih stabil lewat Docker Compose.
- GHCR private image, volume persistence, dan workflow update bikin operasional lebih rapi.
- Cloudflare Tunnel memungkinkan akses HTTPS aman tanpa buka port router.

---

Setelah menghabiskan akhir pekan dengan urusan kabel dan hardening SSH di Proxmox, sekarang saatnya masuk ke bagian yang paling ditunggu: **deployment**. Fokus kali ini adalah menerbangkan **applyst**, aplikasi tracking yang kubangun dengan **Laravel Octane**.

Kenapa Octane? Karena aku butuh performa tinggi dengan *throughput* yang kencang, apalagi aplikasi ini nantinya menangani data tracking yang nyaris *real-time*.

## Drama di Balik Docker & Private Registry

Aku memilih **Docker** karena ingin lingkungan yang konsisten antara laptop Mac dan VM di Proxmox. Tantangan pertama muncul saat menarik image dari **GitHub Container Registry (GHCR)**. Karena image applyst bersifat privat, aku perlu melakukan "handshake" menggunakan *Personal Access Token* (PAT).

Ada satu pelajaran berharga di sini. Sempat muncul error `permission denied` saat menjalankan Docker. Ternyata, user-ku belum "diwisuda" masuk grup Docker.

```bash
sudo usermod -aG docker $USER
newgrp docker
``` 

`newgrp docker` ini jadi penyelamat instan karena perubahan grup langsung aktif di sesi saat ini, jadi nggak perlu reboot atau keluar-masuk SSH berkali-kali.

## Orkestrasi dengan Docker Compose

Untuk menjaga aplikasi dan database tetap sinkron, aku memakai **Docker Compose**. Laravel Octane kupasangkan dengan **MySQL 8.4**. Satu poin yang nggak boleh dilewatkan adalah **volume persistence**. Jangan sampai saat kontainer di-restart, data tracking yang sudah dikumpulkan malah hilang ditelan bumi.

Di jaringan internal Docker, aplikasi Laravel harus mengarah ke nama service database, bukan localhost. Artinya, di file `.env` nilai `DB_HOST` wajib diisi `db` (nama service MySQL), bukan `127.0.0.1`.

Karena nyangkut kredensial, aku juga selalu memastikan file `.env` masuk `.gitignore` dan tidak pernah hardcode password database langsung di `docker-compose.yml`.

```yaml
services:
  app:
    image: ghcr.io/masmuss/applyst:1.3.0
    container_name: applyst_app
    ports:
      - "8000:8000"
    env_file: .env
    depends_on:
      db:
        condition: service_healthy
  db:
    image: mysql:8.4
    volumes:
      - ./mysql_data:/var/lib/mysql
    healthcheck:
      test: ["CMD-SHELL", "mysqladmin ping -h localhost -u$${MYSQL_USER} -p$${MYSQL_PASSWORD} || exit 1"]
      interval: 10s
      timeout: 5s
      retries: 5
```

Healthcheck ini berguna buat kasus klasik Octane: aplikasi sudah up duluan, tapi database belum siap menerima koneksi. Dengan `depends_on` + `service_healthy`, startup jadi lebih tangguh.

:::note
Selalu gunakan tag versi spesifik (seperti `:1.3.0`) daripada `:latest` agar kita punya kontrol penuh saat update.
:::

## Cloudflare Tunnel

Ini bagian paling "ajaib". IP publikku di rumah sudah dipakai layanan lain di port 80 dan 443. Kalau pakai port forwarding tradisional, pasti bakal bentrok dan ribet urusan sertifikat SSL.

Solusinya: **Cloudflare Tunnel**.
Alih-alih membuka port di router, aku memasang `cloudflared` di VM. Tool ini membuat jalur khusus ke Cloudflare secara *outbound*. Di dashboard Cloudflare Zero Trust, bagian Public Hostname aku set ke Service `HTTP` dengan URL `http://localhost:8000`. Hasilnya:

- Tidak perlu buka port di router (lebih aman).
- HTTPS otomatis dari Cloudflare (nggak perlu pusing Certbot).
- Subdomain `applyst.khoirul.me` langsung mengarah ke port `8000` di VM-ku tanpa bentrok dengan web lain.

## Maintenance: Update Tanpa Ribet
Proyek yang bagus adalah proyek yang mudah dirawat. Saat ada pembaruan di aplikasi, aku cukup menaikkan versinya lalu menjalankan satu baris perintah "sakti":

```bash
docker compose pull && docker compose up -d && docker image prune -f
```

Baris ini akan menarik image terbaru, mengganti kontainer lama, lalu membersihkan image "sampah" agar penyimpanan Proxmox nggak cepat penuh.


Dari eksperimen weekend ini, aku belajar satu hal penting: deployment yang sehat itu bukan cuma soal aplikasi bisa jalan, tapi juga soal alur operasional yang aman, rapi, dan mudah diulang.
