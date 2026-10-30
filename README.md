# Portofolio 3D

Website portofolio dengan ID card dan lanyard 3D yang bisa diseret (Three.js).

## Struktur
```
portofolio-3d/
├── index.html          halaman utama (konten teks, proyek, kontak)
├── projects.html       halaman semua proyek (filter, pencarian, detail)
├── css/style.css       semua gaya tampilan
├── js/
│   ├── config.js       nama, jabatan, ID, email, path foto  <- ubah di sini
│   ├── projects-data.js daftar proyek  <- tambah proyek di sini
│   ├── projects.js     logika halaman proyek
│   ├── setup.js        renderer, kamera, cahaya
│   ├── card.js         tekstur & model kartu
│   ├── lanyard.js      tali fisika, motif tali, pengait
│   ├── effects.js      partikel, cincin, bentuk melayang
│   ├── interaction.js  ukuran layar, scroll, seret/ketuk kartu
│   └── main.js         loop animasi
└── assets/
    ├── images/         foto.jpg (fotomu)
    │   └── projects/   gambar tiap proyek
    ├── icons/          favicon.svg
    └── vendor/         three.min.js (r128, salinan lokal)
```

## Menjalankan
Gunakan server lokal supaya foto bisa dimuat ke 3D (membuka index.html langsung dengan klik ganda akan memblokir foto):

- `python3 -m http.server 8000` lalu buka http://localhost:8000
- atau `npx serve`, atau ekstensi Live Server di VS Code.

## Mengganti data
1. Taruh foto di `assets/images/foto.jpg`.
2. Ubah nama, jabatan, ID, dan email satu kali di `js/config.js`; nama dan email akan dipakai konsisten di halaman utama, halaman proyek, dan kartu 3D.
3. Ubah teks profil, proyek pilihan, dan keahlian langsung di `index.html`. Daftar proyek lainnya ada di `js/projects-data.js`.

Urutan `<script>` di index.html penting, jangan diubah.

## Menambah proyek
1. Taruh gambar (rasio 16:10, mis. 1280x800) di `assets/images/projects/`.
2. Salin satu blok di `js/projects-data.js`, lalu ubah judul, kategori, tahun, deskripsi, tag, dan path gambar.
3. Kategori baru otomatis muncul sebagai tombol filter. Kosongkan `demo` atau `repo` jika tidak ada.
4. Tiga proyek di bagian "Proyek pilihan" pada `index.html` masih ditulis manual, ubah juga jika perlu.
