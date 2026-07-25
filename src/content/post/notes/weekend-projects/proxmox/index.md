---
title: "Menjinakkan Proxmox & SSH Hardening - Weekend Projects"
description: Catatan teknis tentang pengalamanku mengelola server Proxmox, termasuk hardening SSH untuk meningkatkan keamanan.
date: 24 April 2026
tags: ["tech", "devlog", "homelab"]
---

##### tl;dr

- Bangun homelab sendiri memberiku kendali penuh atas infrastruktur.
- Proxmox + Ubuntu VM + SSH hardening jadi fondasi yang stabil dan aman.
- Dengan Cloudflare Tunnel, aplikasiku bisa online lewat HTTPS tanpa buka port publik.

---

Semua berawal dari rasa penasaran: *"Kenapa harus bayar VPS mahal tiap bulan kalau ada hardware nganggur di pojok kamar?"* Dari situ, aku memutuskan menyulap satu mesin jadi node **Proxmox** di rumah.

Meski Proxmox adalah "kanvas"-nya, bintang utamanya kali ini adalah proses menyiapkan **Virtual Machine (VM)** Ubuntu Server untuk menjalankan applyst, aplikasi tracking yang sedang kukembangkan.

## Cerita di Balik Layar (The Why)

Membangun homelab itu seru, tapi juga menantang. Aku harus mikirin sirkulasi udara (apalagi rumahku di daerah tropis yang panasnya minta ampun) sampai urusan routing ISP yang kadang suka bertingkah. Tapi rasa puas saat dashboard Proxmox menyala hijau memang nggak ada tandingannya.

## Menghidupkan Sang "Tamu" (VM Setup)

Aku memilih Ubuntu Server sebagai OS utama di VM. Begitu instalasi selesai, langkah pertama adalah menetapkan identitas yang jelas: **IP statis**.

Aku pakai **Netplan** untuk memastikan VM ini selalu berada di `10.10.4.106`. Kenapa penting? Karena tanpa IP tetap, komunikasi antar layanan di homelab bisa berantakan setiap kali router di-restart.

```yaml
# /etc/netplan/01-netcfg.yaml
network:
  version: 2
  ethernets:
    enp0s3:
      addresses: [10.10.4.106/24]
      routes:
        - to: default
          via: 10.10.4.1
```

## Menutup Pintu Belakang (SSH Hardening)

Setelah VM punya alamat tetap, waktunya memasang "gerbang" yang kuat. Aku nggak mau homelab jadi sarang bot *brute-force*.

- **Lupakan password**: Aku generate key `ed25519` di Mac. Cukup sekali `ssh-copy-id`, login ke server jadi lebih cepat dan aman.
- **Langkah final**: Setelah login via key dipastikan aman, aku masuk ke `sshd_config` lalu mengubah `PasswordAuthentication` jadi `no`. Ini momen paling lega karena akses berbasis password benar-benar ditutup.
- **Aktifkan konfigurasinya**: Setelah edit `sshd_config`, jangan lupa restart service SSH supaya perubahan benar-benar diterapkan.

```bash
sudo systemctl restart ssh
sudo systemctl status ssh
```

## Drama Container & PHP Octane

Tujuan akhir VM ini adalah menjalankan **Laravel Octane** dan **MySQL 8.4**. Karena aku suka efisiensi, semuanya kubungkus dalam **Docker Compose**.

Sempat ada sedikit drama teknis. Saat menjalankan `docker compose up`, aku kena error *permission denied*. Ternyata user `rbxch` belum masuk grup `docker`. Setelah menyesuaikan grup user dan re-login singkat, semuanya jalan normal. Image aplikasi ditarik langsung dari **GHCR (GitHub Container Registry)** pakai token privat.

## Menembus Batas (Cloudflare Tunnel)

Masalah klasik homelab: *gimana caranya orang luar bisa akses web tanpa harus buka port di router?* Apalagi IP publikku sudah dipakai layanan lain.

Di sini **Cloudflare Tunnel** jadi pahlawan. Alih-alih *port forwarding* manual yang ribet (dan berisiko), aku pasang `cloudflared` di VM. Hasilnya, [applyst.khoirul.me](https://applyst.khoirul.me) sekarang bisa diakses lewat HTTPS yang aman tanpa bentrok dengan layanan lain di port 80/443.


Dari proyek kecil ini, aku belajar satu hal penting: infrastruktur pribadi itu bukan cuma soal hemat biaya, tapi soal punya kendali penuh. Mulai dari jaringan, keamanan, sampai proses deploy, semuanya bisa kita atur dengan standar kita sendiri.