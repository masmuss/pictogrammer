---
title: "Becoming Astron #14 — Island Architecture in Action: Memberi Nyawa Secara Selektif"
description: "Pernah merasa sayang harus mengirim 1MB JavaScript hanya untuk satu tombol dropdown? Di Astro, kita memberikan JavaScript hanya untuk bagian yang butuh saja."
date: 12 May 2026
tags: ["astro", "tech"]
---

Pada Bagian 1, kita sudah membahas teori Island Architecture. Sekarang, mari kita lihat bagaimana cara memakainya secara nyata. 

Katakanlah kamu sangat menyukai **React** untuk membuat komponen interaktif. Di Astro, kamu bisa tetap menggunakannya tanpa harus mengorbankan performa.

## Langkah 1: Menambahkan Framework

Pertama, beritahu Astro bahwa kita ingin memakai React:

```bash
npx astro add react
```

## Langkah 2: Membuat Komponen React

Buatlah file komponen React biasa di `src/components/Counter.jsx`:

```jsx title="src/components/Counter.jsx"
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState<number>(0);
  return (
    <button onClick={() => setCount(count + 1)}>
      Angka: {count}
    </button>
  );
}
```

## Langkah 3: Mengontrol Hidrasi (The Magic Part)

Jika kamu hanya melakukan import komponen tersebut ke file `.astro`, ia akan dirender menjadi **HTML statis** (tombolnya tidak akan bisa diklik).

```astro
---
import Counter from '../components/Counter';
---
<!-- Ini akan mati (statis) -->
<Counter />
```

Untuk "menghidupkannya", kita menggunakan direktif `client:*`:

1. **`client:load`**: Langsung hidup saat halaman dibuka.
   ```astro
   <Counter client:load />
   ```
2. **`client:visible`**: Hanya hidup saat user scroll sampai komponen ini terlihat (sangat bagus untuk performa).
   ```astro
   <Counter client:visible />
   ```
3. **`client:only`**: Hanya dirender di client (melewati proses SSR).

## Kenapa Ini Jenius?

Website kamu tetap 90% HTML statis yang super cepat. Hanya "pulau-pulau" kecil (seperti tombol counter tadi) yang mengunduh dan menjalankan JavaScript. 

Browser tidak perlu bekerja keras membangun ulang (hydrating) seluruh halaman. Ia hanya fokus pada apa yang kamu minta.

## Tips Astron
Gunakan `client:visible` sebanyak mungkin untuk komponen yang ada di bawah (footer, komentar, dll). Ini akan membuat nilai Google Lighthouse kamu tetap hijau (100) karena JavaScript tidak di-load sampai benar-benar diperlukan.

Di tulisan berikutnya, kita akan membahas bagaimana menghubungkan website kita ke dunia luar dengan **Data Fetching**. Sampai jumpa besok!
