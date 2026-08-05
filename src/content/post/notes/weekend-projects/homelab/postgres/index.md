---
title: "Satu Postgres untuk 7 Layanan: Kenapa Aku Membunuh 6 Instance - Weekend Projects"
description: Catatan teknis (dan curhat) tentang keputusan radikal mengganti 7 container PostgreSQL jadi satu instance aja buat seluruh layanan homelab.
date: 3 August 2026
tags: ["tech", "homelab", "devlog", "docker", "postgres"]
---

**tl;dr**

- Punya 7 container PostgreSQL yang mostly nganggur itu boros banget — hampir 1 GB RAM hilang buat hal yang nggak ngapa-ngapain.
- Aku ganti semuanya jadi **satu instance PostgreSQL** dengan satu database + satu user per layanan, isolasi tetap jalan.
- Trade-off-nya ada: noisy neighbor (Immich ganggu Grafana), single point of failure, dan backup belum per-database. Tapi buat homelab, worth it.
- Nambah layanan baru sekarang cuma 30 detik: edit `db.secrets.yml` + re-run script. Nggak ada drama container baru.

---

Ada satu momen yang bikin aku berhenti sejenak dan ngecek `docker stats`. Waktu itu homelab-ku jalan dengan 7 layanan: Grafana, Immich, n8n, Paperless-ngx, Authentik, Gitea, Firefly III. Semuanya punya container PostgreSQL sendiri-sendiri. Masing-masing duduk manis di pojokan, ngabisin RAM 60-150 MB, CPU idle 2%, dan... nggak ngapa-ngapain.

Tujuh container database. Tujuh backup script. Tujuh konfigurasi yang harus di-update kalau PostgreSQL rilis versi baru. Tujuh hal yang bisa rusak diam-diam tanpa aku sadari.

Di titik itu aku mutusin: **ini nggak sustainable.**

## The Math: Kenapa 7 Instance Itu Masalah

Homelab-ku jalan di mesin dengan RAM 16 GB. Itu udah harus dibagi buat Proxmox, beberapa VM, dan semua layanan yang berjalan. PostgreSQL sendiri—sebelum ada query yang nyentuh tabel—udah ngambil porsi segini:

| Apa                                          | Per container | × 7         |
| -------------------------------------------- | ------------- | ----------- |
| RAM idle (Alpine)                            | ~60 MB        | 420 MB      |
| WAL + shared buffers                         | ~90 MB        | 630 MB      |
| Docker overhead (network namespace, overlay) | ~15 MB        | 105 MB      |
| **Total RAM terbuang**                       |               | **~1.1 GB** |

1 GB lebih cuma buat database yang sebagian besar waktunya _nganggur_. Itu baru RAM. Angka itu juga belum termasuk instance PostgreSQL buat proyek-proyekku sendiri — server ini juga aku pakai buat development dan production, dan beberapa di antaranya butuh PostgreSQL. Kalau ditotal, jumlah instance-nya bisa lebih dari tujuh.

Belum ngomongin:

- **Config drift**: satu container udah pindah ke PostgreSQL 16, yang lain masih 15, yang satu lagi masih 14 karena "nanti aja update-nya"—dan "nanti" itu nggak pernah datang.
- **Backup setengah mati**: tujuh cron job, tujuh `pg_dump`, tujuh file yang tersebar di folder berbeda. Satu lupa di-update path-nya, dan kamu nggak akan tau sampai hari kamu butuh restore.
- **Port collision**: tiap container expose port sendiri-sendiri. `5433`, `5434`, `5435`... harus diingat-ingat, harus di-dokumentasiin, harus dipastiin nggak bentrok. Capek sendiri.

Masalah sebenarnya bukan di RAM. Masalah sebenarnya adalah **maintenance fatigue** — makin banyak komponen yang harus dirawat, makin besar kemungkinan ada yang bocor di antara celah-celahnya.

## The Bet: Satu Instance, Tetap Terisolasi

Jawaban simplenya: "Ya udah, pakai satu instance aja, bikin database terpisah per layanan."

Betul. Tapi aku nggak berhenti di situ. Aku pengen tiap layanan _merasa_ seperti punya database sendiri, meskipun di balik layar PostgreSQL cuma berjalan sekali. Jadi ini aturan main yang ku pakai:

- **Satu container PostgreSQL 18 Alpine.** Satu proses, satu volume mount, satu file konfigurasi.
- **Satu database per layanan.** `grafana`, `immich`, `n8n`, dan seterusnya. Nggak ada sharing schema, nggak ada tabel campur aduk.
- **Satu user per database.** Tiap layanan konek dengan role-nya sendiri, password sendiri, privilege `LOGIN`. Service A nggak bisa lihat tabel Service B.
- **Schema isolation.** Begitu database dibuat, script langsung nge-revoke akses `public` schema dari `PUBLIC` dan ngasih cuma ke owner-nya.

Ini bukan multi-tenancy ala SaaS. Nggak ada resource governance, nggak ada connection limit per user, nggak ada row-level security. Cukup buat mencegah kecelakaan: Immich nggak bisa `DROP TABLE` data Grafana, dan container n8n yang kena breach nggak bisa enumerate semua database.

Buat homelab, itu cukup.

### Yang sengaja nggak kulakukan

1. **Schema-per-service dalam satu database.** Kedengerannya rapi — satu connection string template buat semua. Tapi di lapangan, isolasi level schema di PostgreSQL itu awkward. `search_path` gymnastics, extension yang scoped per database bukan per schema, dan beberapa ORM (kayak `xorm` yang dipakai Gitea) ngasumsikan mereka punya database sendiri. Database terpisah menjaga semua asumsi tiap service tetap utuh.

2. **Pgbouncer atau connection pooling.** Belum. Tujuh layanan, masing-masing connection pool 5-10, total paling ~50 koneksi peak. PostgreSQL bisa handle ratusan di spek modest. Pooling baru diperlukan kalau nanti layanan udah 20+ atau ada yang bocor koneksi. Aku pin dulu, lanjut.

3. **Kubernetes, Ansible, Terraform.** Cuma shell script dan `yq`. Homelab nggak butuh infrastructure-as-code. Homelab butuh _infrastructure-that-does-not-break-at-2-AM_.

## The Setup: Isi Repo, Dibedah Satu-satu

Struktur foldernya simpel banget:

```
homelab-postgres/
├── compose.yaml                    # Docker Compose config
├── .env                            # Kredensial superuser (gitignored)
├── .env.example                    # Template-nya
├── db.secrets.yml                  # Daftar user & database (gitignored)
├── db.secrets.example.yml          # Template-nya
├── scripts/
│   ├── init.sql                    # First-time init: extension, config
│   └── create_users_and_db.sh      # Bikin user & database dari db.secrets.yml
└── pg_vol/                         # Volume data PostgreSQL (gitignored)
```

### `compose.yaml` — keputusan-keputusan kecil

```yaml
services:
  postgres:
    image: postgres:18.4-alpine3.23
    shm_size: 256m
    security_opt:
      - no-new-privileges:true
    environment:
      - POSTGRES_INITDB_ARGS=--data-checksums
      - TZ=${TIMEZONE}
      - PGTZ=${TIMEZONE}
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "3"
```

Beberapa pilihan yang perlu dijelasin kenapa:

- **Alpine, bukan Debian.** Image Alpine ~40% lebih kecil (150 MB vs 250 MB). Di production aku bakal pilih Debian demi kompatibilitas `glibc` (GNU C Library yang dipakai mayoritas distro Linux). Tapi di homelab yang isinya Go dan Node services, `musl` — C library ringan bawaan Alpine — nggak pernah jadi masalah.

- **`--data-checksums`.** Di-enable pas init karena nggak bisa dinyalakan belakangan tanpa full dump-reload. Overhead CPU-nya kecil banget di tiap page write, tapi manfaatnya gede: PostgreSQL bisa deteksi korupsi disk dan return error, bukannya diam-diam ngasih data sampah. Aku belum pernah butuh fitur ini. Justru itu intinya.

- **`shm_size: 256m`.** PostgreSQL alokasi shared memory dari `/dev/shm` buat parallel query. Default Docker 64 MB cukup buat single-user, tapi 7 layanan yang kebetulan barengan `pg_dump` pas cron job bisa bikin jebol. 256 MB itu asuransi murah.

- **`no-new-privileges:true`.** Kalau proses PostgreSQL kena compromise, container nggak bisa naikin privilege kernel tambahan. Keamanan homelab bukan paranoia. Ini realisasi bahwa Immich — atau layanan apapun yang kamu expose di homelab — bisa aja kena serangan dari luar.

### Secrets management tanpa drama

Nggak ada Vault. Nggak ada `sops`. Nggak ada "environment file yang mana ya buat service ini?" Cuma dua file:

**`.env`** — superuser + timezone:

```bash
POSTGRES_USER=postgres
POSTGRES_PASSWORD=super_secret
TIMEZONE=Asia/Jakarta
```

**`db.secrets.yml`** — daftar user + database per layanan:

```yaml
postgres:
  - user: grafana
    password: ${GRAFANA_DB_PASSWORD}
    dbname: grafana
  - user: immich
    password: ${IMMICH_DB_PASSWORD}
    dbname: immich
  - user: n8n
    password: ${N8N_DB_PASSWORD}
    dbname: n8n
```

Referensi `${...}` di password itu disengaja dan di-resolve sama `envsubst` di dalam script. Aku bisa milih: either tulis password langsung di `db.secrets.yml` (simpel, udah gitignored juga), atau refer ke environment variable — berguna kalau service terkait udah punya password di `.env`-nya sendiri dan aku pengen single source of truth.

### Script jantung: `create_users_and_db.sh`

Script ini baca `db.secrets.yml` pakai `yq`, lalu bikin role dan database satu per satu. Yang paling krusial: **idempotensi**.

```bash
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = '$user') THEN
    CREATE ROLE $user WITH LOGIN PASSWORD '$password_sql';
    RAISE NOTICE 'CREATE ROLE';
  ELSE
    RAISE NOTICE 'SKIP';
  END IF;
END $$;
```

Pembuatan role dibungkus `DO` block yang ngecek `pg_catalog.pg_roles` dulu. Kalau udah ada, skip. Begitu juga `CREATE DATABASE` — kalau database udah ada, error-nya ditangkap dan ditampilin sebagai `SKIP`. Hasilnya: script ini aman di-re-run kapan aja. Nambah service baru? Edit YAML, re-run, service lama aman.

Setiap script infrastruktur harus idempoten. Kalau nggak bisa dijalankan dua kali, itu bukan script. Itu doa.

### `init.sql` — yang jalan cuma sekali

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
```

Dua extension, nggak lebih. `uuid-ossp` karena setengah layanan yang kujalankan (Authentik, Firefly III) generate UUID. `pgcrypto` karena `gen_random_uuid()` adalah cara modernnya dan aku pengen tersedia di semua database. Keduanya di-install di database `postgres` dan diwariskan ke database baru lewat template.

Perhatikan yang sengaja _dikomenin_:

```sql
-- CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";
-- ALTER SYSTEM SET log_min_duration_statement = 1000;
```

`pg_stat_statements` butuh `shared_preload_libraries` di `postgresql.conf`, yang artinya harus rebuild container dengan custom config mount. Aku belum perlu profiling query. Nanti pas perlu, tinggal dinyalakan. Setup guide yang maksa kamu install semua extension di hari pertama itu _performance-tuning cosplay_.

## Nambah Service Baru Cuma 30 Detik

Ini bagian paling satisfying dari arsitektur satu instance. Misal aku mau nambah **Plausible Analytics** ke homelab. Database setup-nya:

**Step 1:** Satu entry di `db.secrets.yml`:

```yaml
postgres:
  # ... existing services
  - user: plausible
    password: ${PLAUSIBLE_DB_PASSWORD}
    dbname: plausible
```

**Step 2:** Re-run script:

```bash
./scripts/create_users_and_db.sh
```

Output-nya:

```
grafana/grafana
SKIP
SKIP

immich/immich
SKIP
SKIP

plausible/plausible
CREATE ROLE
CREATE DATABASE
GRANT

✅ All done.
```

Service existing nge-print `SKIP`. Yang baru dapet role, database, dan permission. Nggak ada container baru. Nggak ada port mapping tambahan. Nggak ada backup script baru. Seluruh proses lebih cepet dari kamu baca bagian ini.

Bandingin sama cara lama: copy-paste `compose.yaml` fragment, ganti nama container, atur port biar nggak tabrakan, tambahin volume mount, bikin backup cron job baru, inget-inget buat update semuanya pas PostgreSQL 19 rilis. Aduh.

## Yang Rusak & Yang Kupelajari

Nggak ada tulisan homelab yang jujur tanpa bagian "ini lho yang error."

### Backup adalah afterthought

Sebulan pertama, strategi backup-ku adalah `pg_dumpall` ke file, dijalankan manual kalau inget. Strategi ini punya nama lain: _berharap._

Sekarang udah lebih baik:

```bash
docker compose exec -T postgres pg_dumpall -U postgres | gzip > backup-$(date +%Y%m%d).sql.gz
```

Daily via cron, auto-upload ke Backblaze B2 pakai `rclone`. Tapi masih belum ideal — `pg_dumpall` ngunci seluruh instance selama proses dump, dan kalau restore harus semua database sekaligus. Per-database dump jauh lebih fleksibel: satu service rusak, restore satu doang. Itu PR berikutnya.

### Immich si tetangga berisik

Immich jalanin background jobs lumayan berat: thumbnail generation, face detection, metadata extraction. Pas lagi ngeproses batch foto baru, query PostgreSQL-nya berebut resource sama Grafana dashboard dan Authentik auth check. Aku pernah lihat panel Grafana butuh 3 detik buat loading pas Immich lagi impor.

Solusinya simpel: batasi `max_connections` Immich di connection pool-nya sendiri, dan jadwalkan background jobs di jam-jam yang nggak overlap sama jam aku biasa buka Grafana. Resource governance di level aplikasi, bukan level database. Cukup buat homelab, nggak cukup buat production.

### Monitoring: gelap gulita

`pg_stat_statements` masih dikomenin. Nggak ada alert kalau ada query yang jalan 10 detik. Nggak ada dashboard buat cache hit ratios. Nggak tau service mana yang paling rajin nge-write.

Ini bukan males. Ini prioritas. Homelab-ku bukan database rumah sakit — kalau Grafana nambah 1 detik loading, aku nggak akan mati. Tapi aku tau aku terbang buta, dan pertama kali ada service yang pelan-pelan degradasi tanpa ketahuan, aku bakal nyesel nggak pasang metrik dari awal.

## Buat Siapa Pola Ini Cocok?

Jawabannya tergantung satu pertanyaan: **kamu ngurusin homelab atau production cluster?**

Kalau kamu hosting layanan buat keluarga, side projects, atau rasa penasaran pribadi — satu instance PostgreSQL dengan database terpisah per layanan adalah trade-off yang tepat. Simplisitasnya berbuah tiap kali kamu nambah service, ngejalanin backup, atau upgrade versi PostgreSQL.

Kalau kamu hosting buat _paying customers_, stop baca tulisan ini dan bikin instance terpisah per service. Plus replica. Plus connection pooling. Plus monitoring stack yang memadai.

Buat kita yang di tengah-tengah: pola satu instance ini bekerja sampai dia nggak bekerja. Kamu bakal tau kapan batasnya tercapai karena bakal ada service spesifik yang protes duluan. Sampai saat itu tiba, nikmatin 1 GB RAM yang balik dan kenyataan bahwa backup script kamu cuma satu.

_Full setup, script, dan konfigurasi ada di repositori dibawah. PR dan cerita "ini lho caraku yang beda" selalu ditunggu._

::github{repo="masmuss/homelab-postgres"}
