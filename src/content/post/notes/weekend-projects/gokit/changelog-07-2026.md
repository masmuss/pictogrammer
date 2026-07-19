---
title: "Gokit Starter v0.2.0: Bye Fx & Ent, Hello Manual DI & GORM - Weekend Projects Update"
description: Catatan refactor besar-besaran Gokit Starter. Hapus Uber Fx + Ent + Atlas (~50 dependensi transitif), ganti wiring manual + GORM, rename arsitektur, tambah AGENTS.md, GoReleaser, dan dokumentasi arsitektur.
date: 19 July 2026
tags: ["tech", "golang", "devlog", "refactoring", "open-source"]
---

##### tl;dr

- **Hapus 3 dependency besar**: Uber Fx, Ent ORM, Atlas — total bersihin ~50 packages transitif dari `go.mod`
- **Manual DI**: `main.go` dari 130 baris (Fx annotation) jadi 30 baris wiring eksplisit. Bisa ditrace linear.
- **GORM + AutoMigrate**: Ganti Ent codegen + Atlas migration manual. Ubah struct tag → restart → jalan.
- **Restruktur folder**: `delivery` → `inbound`, `infra` → `outbound`, `modules/auth/infra` → `modules/auth/repository`
- **Production-ready**: CORS fix, error sanitize, graceful shutdown, blacklist fail-closed, audit logging
- **GoReleaser + CHANGELOG**: Release otomatis dengan `git tag`, build 4 binary platform

---

Di [postingan sebelumnya](/blog/notes/weekend-projects/gokit), aku cerita tentang awal mula bikin Gokit Starter — boilerplate Go API buat tim yang lagi transisi dari Laravel. Waktu itu pondasinya udah jadi: module-based architecture, Uber Fx DI, Ent ORM + Atlas migration, JWT auth + organization scoping, Redis caching, dan OpenAPI docs (swaggo).

Tapi setelah dipake sendiri beberapa minggu, aku sadar ada beberapa keputusan arsitektur yang bikin DX (Developer Experience) kurang optimal — terutama buat pemula yang baru belajar Go.

Akhir pekan ini aku dedikasikan buat **refactor besar-besaran**. Hasilnya? `go.mod` slim down drastis, `main.go` makin pendek, dan strukturnya makin gampang dipahami.

::github{repo="masmuss/gokit-starter" label="Lihat di GitHub"}

## Keputusan Besar #1: Hapus Uber Fx

Uber Fx adalah dependency injection framework yang powerful. Ada `fx.Module`, `fx.Provide`, `fx.Invoke`, lifecycle hooks, annotation system. Tapi setelah beberapa minggu pakai, aku nemu masalah:

**Debugging susah.** Stack trace error di Fx panjang banget dan isinya internal Fx frames — bukan kode aplikasi aku. Pas ada dependency yang gagal di-init, errornya cryptic: `fx.Hook.OnStart…` tanpa info jelas dependency mana yang bermasalah.

**Annotation pakai string literal.** `fx.ParamTags(…name:"serviceName"…)`, `fx.ResultTags(…group:"routes"…)` — rawan typo, ga kedetect pas compile. Baru ketauan pas runtime.

**Mental overhead.** Setiap nambah modul baru, developer harus paham Fx annotation system, lifecycle hooks, module tree. Padahal cuma butuh: "ini dependensi A, ini dependensi B, tolong satukan."

### Solusi: Wiring Manual 30 Baris

Aku rewrite seluruh wiring ke `cmd/server/main.go`. Tanpa framework:

```go
func main() {
    cfg := loadConfig()
    db := openDatabase(ctx, cfg, log)
    cache, redis := openCache(cfg, log)

    authMod := authmodule.Wire(authmodule.Dependencies{
        DB: db, CacheStore: cache,
        JWTManager: jwtMgr, Hasher: hasher,
        Log: log, Audit: auditLog,
        Validator: validate.New(),
        AccessTTL: cfg.Auth.JWTTTL * 60,
        RefreshTTL: cfg.Auth.JWTRefreshTTL * 60,
    })

    router := buildRouter(cfg, registrars, docRegistrars, log)
    runServer(ctx, router, port, redis, log)
}
```

Baca `main()` dari atas ke bawah → langsung paham urutan startup. `main()` sudah jadi dokumentasi hidup.

### Bonus: Wire.go Barrel Pattern

Tiap modul sekarang punya `wire.go` yang jadi entry point tunggal:

```go
// modules/auth/wire.go
type Dependencies struct {
    DB             *database.DB
    CacheStore     cache.Cache
    PasswordHasher authtoken.PasswordHasher
    JWTManager     *authtoken.JWTManager
    // ...
}

type Module struct {
    Handler      *handler.AuthHandler
    Registrar    delivery.RouteRegistrar
    DocRegistrar doc.OperationRegistrar
    Middleware   *middleware.AuthMiddleware
}

func Wire(deps Dependencies) Module { ... }
```

Satu struct untuk "apa yang dibutuhkan", satu struct untuk "apa yang disediakan". Mirip Angular `@NgModule` atau NestJS `@Module` — tapi tanpa decorator, tanpa framework.

## Keputusan Besar #2: Ganti Ent + Atlas ke GORM

Ent adalah ORM codegen yang powerful: type-safe query, eager loading, migration terpisah. Tapi workflow development-nya berat:

```
1. Edit schema.go
2. go generate ./ent/...
3. atlas migrate diff
4. atlas migrate apply
```

4 langkah setiap ganti 1 field. Di tahap iterasi cepet, ini bikin frustrasi.

### GORM + AutoMigrate

```go
// Model
type User struct {
    ID    uuid.UUID `gorm:"type:uuid;primaryKey"`
    Email string    `gorm:"size:128;not null;uniqueIndex"`
}

// Startup
gormDB.AutoMigrate(&User{}, &Organization{})
```

Ganti tag struct → restart server → migrasi otomatis. Buat development dan startup, ini workflow yang jauh lebih ramah.

Plus, integration test sekarang pakai SQLite in-memory — ga perlu Docker PostgreSQL. `go test -tags=integration` langsung jalan:

```go
func NewGormDB(t *testing.T) *gorm.DB {
    db, _ := gorm.Open(sqlite.Open("file::memory:?cache=shared"), &gorm.Config{})
    db.AutoMigrate(&User{}, &Organization{})
    return db
}
```

### Dampak ke `go.mod`

| Sebelum                                           | Setelah                                     |
| ------------------------------------------------- | ------------------------------------------- |
| `entgo.io/ent` + `ariga.io/atlas`                 | `gorm.io/gorm` + `gorm.io/driver/postgres`  |
| ~50 packages transitif (HCL, textseg, koanf, ...) | ~3 packages (jinzhu/now, jinzhu/inflection) |

`go.mod` dari 131 baris jadi ~80 baris. Lebih ringan, lebih cepet di-download, lebih sedikit surface area untuk CVE.

## Restruktur Folder: inbound/outbound

Salah satu feedback paling constructive yang aku dapet: dua package bernama `auth` bikin bingung.

```
internal/infra/auth/       ← JWT, bcrypt, blacklist
internal/modules/auth/     ← modul bisnis
```

Setiap file yang import keduanya harus kasih alias: `infraauth`, `authmodule`. Solusinya:

| Before                 | After                          |
| ---------------------- | ------------------------------ |
| `internal/delivery/`   | `internal/inbound/`            |
| `internal/infra/`      | `internal/outbound/`           |
| `internal/infra/auth/` | `internal/outbound/authtoken/` |
| `modules/auth/infra/`  | `modules/auth/repository/`     |

Sekarang nggak ada lagi package name collision. Alias `infraauth` hilang — diganti `authtoken` yang self-documenting.

## Production Readiness

Selain refactor struktural, aku juga beresin beberapa celah production:

### CORS Fix

Sebelumnya: `AllowedOrigins: ["*"]` + `AllowCredentials: true` — **invalid**. Browser bakal tolak semua credentialed request. Fix: hapus `AllowCredentials` karena JWT dikirim via `Authorization` header, bukan cookie.

### Error Sanitization

`WriteAppError` sebelumnya langsung kirim `err.Error()` ke client — termasuk DB host, query, dan stack trace kalau bukan `apperr.Error`. Sekarang error non-apperr di-sanitize jadi `"internal server error"`.

### Graceful Shutdown

`os.Exit(1)` di goroutine server skip semua `defer` cleanup. Fix: pakai error channel + `select` — main goroutine tangkap sinyal atau error, lalu graceful shutdown.

### Token Blacklist Fail-Closed

Redis `Get` error sebelumnya return `false` (token dianggap tidak di-blacklist) — bahaya kalau Redis transient error. Sekarang return `true` — tolak akses kalau blacklist check gagal.

### Audit Logging

Setiap event auth tercatat dengan field terstruktur: `event`, `outcome`, `user_id`, `org_id`, `email`, `ip`. Middleware juga audit token missing/invalid/revoked.

## Parameter Struct: 8 → 1

`Service.New()` tadinya terima **8 parameter**:

```go
func New(repo Repository, hasher PasswordHasher, tokens TokenIssuer,
    refreshTokens RefreshTokenIssuer, verifier TokenVerifier,
    blacklist *TokenBlacklist, expiresIn int, refreshExpires int) *Service
```

Sekarang pakai config struct:

```go
type Config struct {
    Repository     Repository
    Hasher         authtoken.PasswordHasher
    Tokens         authtoken.TokenIssuer
    RefreshTokens  authtoken.RefreshTokenIssuer
    TokenVerifier  authtoken.TokenVerifier
    Blacklist      *authtoken.TokenBlacklist
    ExpiresIn      int
    RefreshExpires int
}

func New(cfg Config) *Service { ... }
```

Begitu juga `JWTManager.Issue` — dari 4 parameter identitas jadi 1 `TokenSubject` struct.

## GoReleaser + Release Workflow

Sekarang release tinggal:

```bash
git tag -a v0.2.0 -m "Release v0.2.0"
git push origin v0.2.0
```

GitHub Actions + GoReleaser otomatis:

1. Build binary untuk `linux/amd64`, `linux/arm64`, `darwin/amd64`, `darwin/arm64`
2. Generate changelog dari commit history
3. Bikin GitHub release + attach binary

Plus `AGENTS.md` di root — panduan buat AI coding agent (Copilot, Zed, Cursor) biar paham konvensi proyek. Dan `docs/architecture.md` + `docs/repository-structure.md` untuk developer baru.

## Yang Belum (Next?)

Refactor ini fokus ke pondasi. Beberapa hal yang masih di wishlist:

- Modul contoh kedua (`product` atau `invoice`) biar makin keliatan pola module-based-nya
- Rate limiting per-endpoint (saat ini cuma global 100 req/menit)
- Refresh token rotation (invalidate old refresh token pas refresh)
- Email verification flow (butuh mailer service)
- CLI generator interaktif (`task new:module` interactive mode)

## Penutup

Refactor akhir pekan ini mengubah Gokit Starter dari "proyek belajar" jadi "starter kit yang (agak) serius". Dependensi lebih dikit, kode lebih pendek, debugging lebih gampang, dan dokumentasi lebih lengkap.

Kalau kamu lagi nyari boilerplate Go yang ga pake magic framework, ga pake codegen, dan bisa langsung dibaca dari `main.go` — boleh banget dicoba.

Feedback, issue, PR selalu diterima.

_Happy coding!_
