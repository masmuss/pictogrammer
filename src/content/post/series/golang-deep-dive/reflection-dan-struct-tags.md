---
title: "Becoming Gopher: Deep Dive #3 — Reflection & Struct Tags: Membedah Isi Go"
description: "Pernah penasaran bagaimana library JSON di Go bisa tahu nama field di struct kita? Mari masuk ke dunia Reflection untuk memahami cara Go melihat dirinya sendiri saat runtime."
date: 21 January 2026
tags: ["tech", "golang", "reflection"]
---

Pernahkah kamu memperhatikan kode seperti ini?

```go
type User struct {
    ID    int    `json:"id" db:"user_id"`
    Name  string `json:"name" db:"full_name"`
}
```

Teks di dalam tanda petik miring (backticks) itu disebut **Struct Tags**. Tapi, bagaimana caranya fungsi `json.Marshal` atau library database tahu kalau field `Name` harus diubah menjadi `full_name`? 

Jawabannya adalah: **Reflection**.

## Apa itu Reflection?

**Reflection** adalah kemampuan sebuah program untuk memeriksa struktur dan nilai dari variabelnya sendiri saat sedang berjalan (*runtime*). Di Go, fitur ini disediakan oleh paket `reflect`.

Meskipun Go adalah bahasa yang *statically-typed* (tipe data ditentukan saat kompilasi), Reflection memungkinkan kita untuk melakukan hal-hal dinamis yang biasanya hanya ada di bahasa seperti Python atau JavaScript.

## Dua Konsep Utama: Type dan Value

Dalam paket `reflect`, ada dua hal yang paling sering kita gunakan:

1.  **`reflect.Type`**: Memberitahu kita tentang "apa" tipe variabel tersebut (nama struct, jenis field, dll).
2.  **`reflect.Value`**: Memberitahu kita tentang "berapa" isi dari variabel tersebut dan memungkinkan kita mengubahnya.

```go
u := User{ID: 1, Name: "Khoirul"}

t := reflect.TypeOf(u)
v := reflect.ValueOf(u)

fmt.Println("Type:", t.Name())  // Output: User
fmt.Println("Kind:", t.Kind())  // Output: struct
```

## Membaca Struct Tags

Ini adalah penggunaan reflection yang paling populer. Kita bisa menginspeksi field dari sebuah struct dan mengambil nilai tag-nya.

```go
for i := 0; i < t.NumField(); i++ {
    field := t.Field(i)
    tag := field.Tag.Get("json")
    fmt.Printf("Field: %s, JSON Tag: %s\n", field.Name, tag)
}
// Output:
// Field: ID, JSON Tag: id
// Field: Name, JSON Tag: name
```

Dengan logika sederhana ini, kita bisa membuat library sendiri yang memproses data berdasarkan tag yang kita definisikan.

## Kapan Harus Menggunakan Reflection?

Reflection adalah alat yang sangat kuat, tapi juga berbahaya. Ada dua alasan utama kenapa kamu harus bijak menggunakannya:

1.  **Performa**: Reflection jauh lebih lambat dibandingkan akses kode biasa karena compiler tidak bisa melakukan optimasi.
2.  **Keamanan (Panic)**: Jika kamu salah melakukan operasi (misal mencoba mengambil nilai dari field yang tidak ada), program kamu bisa langsung `panic` saat runtime.

**Gunakan Reflection hanya jika:**
- Kamu sedang membangun library yang harus menangani tipe data apa pun (seperti serializer, ORM, atau DI container).
- Tidak ada cara lain untuk menyelesaikan masalah tersebut dengan kode biasa atau Generics.

## Kesimpulan

Reflection memberikan Go fleksibilitas yang luar biasa di balik dinding sistem tipenya yang ketat. Struct Tags adalah contoh nyata bagaimana reflection mempermudah hidup kita sehari-hari.

Namun ingat pepatah lama Gopher: *"Clear is better than clever. Reflection is never clear."*

Di postingan selanjutnya, kita akan membahas hal yang lebih praktis untuk manajemen proyek besar: **Go Modules & Workspace**. Sampai jumpa! 🚀
