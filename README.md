# Live Streaming Manager

Aplikasi berbasis Node.js untuk mengelola live streaming video ke Facebook/YouTube tanpa encoding, dengan fitur download video dari Google Drive.

## Fitur Utama

- Live streaming ke Facebook dan YouTube tanpa encoding menggunakan FFmpeg
- Download video dari Google Drive
- Monitoring penggunaan sistem (CPU, Memory, Disk)
- Tampilan dark theme yang modern dan responsif
- Manajemen video (rename, delete)
- Penjadwalan streaming
- Durasi streaming yang dapat diatur

## Prasyarat

- Node.js (versi 14 atau lebih baru)
- FFmpeg terinstal di sistem
- Ubuntu VPS (untuk deployment)
- Akses ke Facebook/YouTube streaming key
- Akses ke Google Drive

## Instalasi

1. Clone repositori ini:
```bash
git clone <repository-url>
cd live-streaming-manager
```

2. Install dependensi:
```bash
npm install
```

3. Pastikan FFmpeg terinstal:
```bash
# Ubuntu
sudo apt update
sudo apt install ffmpeg

# Verifikasi instalasi
ffmpeg -version
```

## Penggunaan

1. Jalankan aplikasi:
```bash
# Mode development dengan auto-reload
npm run dev

# Mode production
npm start
```

2. Buka browser dan akses:
```
http://localhost:8000
```

## Fitur Live Streaming

- Pilih platform (Facebook/YouTube)
- Pilih video dari daftar yang tersedia
- Masukkan stream key dari platform
- Atur jadwal streaming (opsional)
- Atur durasi streaming (opsional, kosongkan untuk streaming tanpa batas)
- Monitor status streaming aktif
- Stop streaming kapan saja

## Fitur Download Video

- Download video dari Google Drive dengan URL
- Lihat daftar video yang sudah didownload
- Rename video
- Hapus video yang tidak diperlukan
- Monitor ukuran file video

## Struktur Direktori

```
.
├── controllers/
├── public/
│   ├── css/
│   └── js/
├── routes/
├── services/
├── videos/
├── views/
├── server.js
└── package.json
```

## Monitoring Sistem

Aplikasi menyediakan monitoring real-time untuk:
- Penggunaan CPU
- Penggunaan Memory
- Penggunaan Disk

Data diperbarui setiap 5 detik dan ditampilkan di header aplikasi.

## Keamanan

- Validasi input untuk semua form
- Sanitasi nama file
- Pengecekan tipe file untuk video
- Pembatasan akses direktori

## Troubleshooting

1. Jika streaming tidak dimulai:
   - Periksa stream key
   - Pastikan video dapat diakses
   - Periksa log FFmpeg untuk detail error

2. Jika download gagal:
   - Pastikan URL Google Drive valid dan dapat diakses publik
   - Periksa koneksi internet
   - Pastikan ada cukup ruang disk

3. Jika sistem tidak responsif:
   - Periksa penggunaan CPU dan Memory
   - Hentikan streaming yang tidak diperlukan
   - Restart aplikasi jika diperlukan

## Kontribusi

Silakan buat issue atau pull request untuk perbaikan atau penambahan fitur.

## Lisensi

ISC