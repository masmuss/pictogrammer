---
title: "Gokit Starter: Boilerplate Go API buat Pemula yang (Akhirnya) Production-Ready - Weekend Projects"
description: Cerita di balik pembuatan Gokit Starter, boilerplate Go API yang lahir dari transisi Laravel ke Golang di platform edtech. Dari scaffolding Chi sampai JWT auth + versioned migration dalam satu akhir pekan.
date: 16 May 2026
tags: ["tech", "golang", "devlog", "backend", "open-source"]
---

##### tl;dr

- **Latar belakang**: Tim migrasi dari Laravel ke Go karena traffic makin membludak. Tiap service baru harus setup struktur folder, DI, migration dari nol. Butuh boilerplate standar.
- **Gokit Starter**: Kit pondasi Go API dengan module-based architecture, Uber Fx DI, Ent ORM + Atlas migration, JWT auth + organization scoping, Redis caching, dan OpenAPI docs.
- **Tech Stack**: Chi router, Ent + PostgreSQL + Atlas, Redis, JWT + bcrypt, swaggo, Uber Fx.
- **Misi**: Bikin starter kit yang terstandarisasi buat tim, dengan fitur production-ready out of the box.

---

Di tempatku bekerja sekarang — sebuah platform teknologi pendidikan — penggunanya makin membludak. Sebelumnya kami pakai Laravel, dan meski sudah di-tuning habis-habisan, ternyata masih kewalahan nanganin traffic. Akhirnya tim mutusin buat pelan-pelan rewrite service ke Golang.

Aku sendiri baru belajar Go sekitar 6 bulanan karena kebutuhan transisi ini. Seru sih, tapi jujur PR banget di awal pas urusan setup struktur folder, wiring dependency, sampe mikirin arsitektur yang pas buat tim.

Daripada tiap mulai service baru harus setup manual dari nol terus, akhir pekan ini aku iseng bikin boilerplate kit sendiri: **Gokit Starter**.

## Kenapa Bikin Sendiri?

Sebelum bikin Gokit, aku sempat riset beberapa starter kit Go yang populer. Masalahnya:

1. **Terlalu kompleks buat tim kecil**: Banyak starter kit yang udah include message broker, workflow engine, gRPC, GraphQL — keren buat portfolio tapi bikin codebase jadi berat buat API REST sederhana.
2. **Arsitektur over-engineered**: Hexagonal architecture dengan 7 file untuk 1 fitur CRUD. Untuk tim yang baru transisi ke Go, ini terlalu banyak _cognitive load_.
3. **Ga ada yang pas**: Beberapa terlalu minimal (cuma scaffold kosong), beberapa terlalu opinionated (framework-specific). Butuh yang middle-ground: cukup lengkap buat production, tapi cukup sederhana buat dipahami dalam sejam.

Jadi aku putusin bikin yang **terstandarisasi tapi tetap sederhana**: Uber Fx untuk DI (ada lifecycle hooks, `fx.Module` tertata rapi), Ent ORM dengan Atlas untuk versioned migration (biar aman pas production), dan module-based architecture yang tiap fiturnya self-contained dalam 4-5 file.

::github{repo="masmuss/gokit-starter" label="Lihat di GitHub"}

## Arsitektur: Module-Based, Bukan Hexagonal Murni

Aku sempat mikir mau pakai hexagonal architecture ala "port & adapter". Tapi setelah liat contoh implementasinya di beberapa proyek, polanya bikin satu fitur sederhana butuh 5-7 file kecil:

```
port/inbound/client.go              → interface HTTP
port/outbound/client.go             → interface DB
domain/client/domain.go             → business logic
adapter/inbound/fiber/client.go     → HTTP handler
adapter/outbound/postgres/client.go → DB implementation
adapter/inbound/fiber/route.go      → route registration
domain/registry.go                  → factory
```

Untuk tim yang baru transisi ke Go, ini terlalu banyak _cognitive load_. Akhirnya aku pilih **module-based layered architecture** yang lebih sederhana:

```
modules/auth/
├── domain/       # Model, error, konstanta
├── app/          # Use case + interface Repository
├── handler/      # HTTP handler + request DTO + route registration
└── infra/        # Implementasi Ent + JWT + bcrypt
```

Satu fitur = 4 folder. Route, handler, request DTO dalam 1 file `auth_handler.go`. Interface (`app/`) dan implementasi (`infra/`) terpisah tapi masih dalam 1 modul. Semua dependency di-wire lewat Uber Fx:

```go
// Di cmd/server/main.go
fx.New(
    // Infrastruktur
    config.Module,
    database.Module,
    redis.Module,

    // Modul bisnis
    authmodule.Module,
    healthmodule.Module,

    // HTTP layer
    delivery.Module,
).Run()
```

### Kenapa Uber Fx?

Beberapa pertimbangan kenapa pilih Fx dibanding wiring manual:

1. **Lifecycle hooks**: `OnStart` / `OnStop` — DB automigrate pas startup, graceful shutdown pas SIGTERM. Ga perlu manage goroutine manual.
2. **Module tree**: `fx.Module` bikin tiap package deklarasi dependensinya sendiri. Nambah modul baru tinggal register `fx.Module`-nya.
3. **Sudah battle-tested**: Dipake di production sama Uber sendiri dan banyak proyek Go skala besar.

Plus, ada bonus keren: dependency graph visualization lewat `go run cmd/server/main.go viz` — bisa liat _visual_ siapa dependensi siapa, berguna banget buat onboarding developer baru.

## Database: Ent + Atlas Versioned Migration

Salah satu keputusan paling krusial adalah gimana ngatur database. Aku pilih **Ent ORM** karena:

```go
// Schema definition di internal/database/schema/user.go
func (User) Fields() []ent.Field {
    return []ent.Field{
        field.UUID("id", uuid.UUID{}).Default(uuid.New),
        field.String("email").Unique().NotEmpty(),
        field.String("password_hash").Sensitive(),
    }
}
```

Ent generate kode Go-nya sendiri — semua query jadi type-safe. Ga mungkin typo nama kolom, ga mungkin salah tipe data pas query. Buat tim yang masih belajar Go, safety net ini penting banget.

### Versioned Migration dengan Atlas

Untuk migration, aku pakai Atlas. Workflow-nya:

```bash
# 1. Edit schema di internal/database/schema/
# 2. Generate kode Ent
task generate
# 3. Bikin file migration SQL
task db:diff name=tambah_kolom_avatar
# 4. Apply migration
task db:migrate
```

Ini workflow yang sengaja _eksplisit_. File SQL migration di-commit ke repo, jadi semua environment punya history migration yang sama. Di production, ini critical — ga boleh ada "eh bentar, gue lupa migrate di staging."

## Fitur Auth yang Solid

Dari awal aku pengen modul auth ini jadi referensi buat modul-modul lain. Jadinya aku bikin cukup lengkap:

- **Register + Login** — dengan JWT access token dan bcrypt password hashing
- **Change password** — verifikasi password lama dulu
- **Organization scoping** — user hanya bisa lihat profil di organisasinya sendiri, `organization_id` di-embed di JWT claims
- **Personal & organizational accounts** — satu user bisa punya akun personal sekaligus tergabung di beberapa organisasi
- **Status check** — user banned/inactive ditolak login
- **Security middleware** — CORS, secure headers, rate limiting global

Semua endpoint udah punya validasi input, error message yang terstruktur (pakai standardized error system), dan unit test coverage untuk service + handler layer dengan mockery.

## OpenAPI Docs dengan Swaggo

Dokumentasi API pakai swaggo — nambahin annotation di comment handler:

```go
// @Summary Login user
// @Tags auth
// @Accept json
// @Produce json
// @Param request body LoginRequest true "Login payload"
// @Success 200 {object} LoginResponse
// @Router /auth/login [post]
func (h *AuthHandler) Login(w http.ResponseWriter, r *http.Request) {
```

Buka `/swagger/index.html` langsung dapet Swagger UI. Buat tim frontend yang butuh referensi API, ini udah cukup banget.

## Fondasi Infrastruktur

Selain auth, aku juga setup beberapa fondasi yang kepake di banyak modul:

- **Redis caching** — `internal/platform/redis/` dengan connection pooling, siap dipake buat rate limiting atau cache
- **In-memory event bus** — `internal/shared/eventbus/` untuk komunikasi antar modul secara loose-coupled
- **Standardized error system** — `internal/shared/apperr/` dengan error code, HTTP status mapping, dan validasi input
- **Fail-fast config** — validasi semua environment variable pas startup, aplikasi ga mau jalan kalau ada config yang missing

Semua komponen ini udah terintegrasi lewat Fx module system — tinggal tambahin ke `fx.New(...)` di `main.go`.

## Setup Lokal dalam 3 Langkah

```bash
git clone git@github.com:masmuss/gokit-starter.git
cp .env.example .env
docker compose up -d && task server
```

Buka `http://localhost:8080/swagger/index.html` buat eksplor API.

## Penutup & Rencana ke Depan

Gokit Starter masih "bayi" di ekosistem Go. Aku yakin masih banyak celah yang bisa diperbaiki. Tapi setidaknya sekarang tim aku punya pondasi standar buat mulai service baru tanpa setup dari nol.

Ke depannya aku pengen:

- Nambah modul contoh kedua (mungkin `product` atau `order`) biar makin keliatan pola module-based-nya
- Migrasi ke OpenAPI yang lebih modern (swaggo udah mulai kurang di-maintain)
- Nambah test coverage untuk integration test dengan real PostgreSQL
- Bikin CLI generator modul biar tinggal `task new:module auth` langsung jadi

Buat suhu-suhu Go yang udah lama di dunia backend: boleh banget mampir ke repo, open issue, atau kasih feedback. _Roasting_ diterima dengan lapang dada.

_Happy coding!_
