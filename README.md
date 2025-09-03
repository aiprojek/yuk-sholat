# Yuk Sholat - Jadwal Sholat Digital untuk Masjid

![Yuk Sholat Banner](https://raw.githubusercontent.com/aiprojek/asset/main/1721544026391.png)

**Yuk Sholat** adalah aplikasi jadwal sholat digital berbasis web yang dirancang khusus untuk ditampilkan di monitor atau TV masjid. Aplikasi ini modern, kaya fitur, dapat dikustomisasi sepenuhnya, dan yang terpenting, dapat berfungsi 100% offline setelah pengaturan awal selesai.

Aplikasi ini terinspirasi dari fungsionalitas dan desain [Mawaqit](https://mawaqit.net/), namun dengan pendekatan yang berbeda untuk pengguna. Di mana Mawaqit memerlukan pembuatan akun dan pengaturan melalui *backoffice*, Yuk Sholat dirancang untuk kesederhanaan maksimal: tidak perlu akun, dan semua data serta pengaturan disimpan langsung di browser perangkat Anda.

Aplikasi ini bersifat gratis dan _open-source_, dibangun dengan tujuan untuk memodernisasi cara masjid menampilkan informasi waktu sholat kepada jamaah.

---

### Tampilan Aplikasi

| Tampilan Landscape (Datar) | Tampilan Portrait (Tegak) |
| :---: | :---: |
| _Screenshot tampilan landscape aplikasi_ | _Screenshot tampilan portrait aplikasi_ |
| ![Landscape View](https://raw.githubusercontent.com/aiprojek/asset/main/ss-ys-landscape-red.png) | ![Portrait View](https://raw.githubusercontent.com/aiprojek/asset/main/ss-ys-portrait-red.png) |

---

## ✨ Fitur Utama

-   **🌐 Mode Offline:** Setelah jadwal sholat bulanan diunduh, aplikasi tidak lagi memerlukan koneksi internet. Semua pengaturan dan file (wallpaper, suara alarm) disimpan secara lokal di browser.
-   **🎨 Kustomisasi Penuh:**
    -   Ubah nama masjid, teks berjalan, tema warna (terang/gelap), dan warna aksen.
    -   Gunakan gambar latar belakang dari URL atau unggah dari komputer.
    -   Gunakan suara alarm adzan dari URL atau unggah file audio Anda sendiri.
-   **🕋 Jadwal Sholat Akurat:**
    -   Pilih sumber jadwal dari **API Otomatis** (menggunakan [Aladhan API](https://aladhan.com/prayer-times-api)) atau input **Manual**.
    -   Dukungan berbagai metode kalkulasi, termasuk **Kemenag RI**.
    -   Pengaturan lanjutan untuk Mazhab Asar, metode lintang tinggi, dan koreksi waktu manual per sholat.
-   **🔄 Alur Sholat Otomatis:**
    -   Hitung mundur menuju waktu sholat berikutnya.
    -   Notifikasi visual saat waktu **Adzan** tiba.
    -   Hitung mundur menuju **Iqomah**.
    -   Pengingat untuk menyenyapkan HP sebelum sholat dimulai.
    -   Tampilan khusus saat **Sholat Berjamaah** sedang berlangsung.
    -   Tampilan **Dzikir** setelah sholat selesai.
-   **📱 Desain Responsif:** Tampilan otomatis menyesuaikan dengan orientasi layar, baik **landscape (datar)** maupun **portrait (tegak)**.
-   **📜 Konten Islami Dinamis:**
    -   Tampilkan teks berjalan manual, atau pilih untuk menampilkan **ayat Al-Quran** dan **Hadits** secara acak dan bergantian.
    -   Tema konten dapat dipilih (misal: Keimanan, Akhlak, dll).
    -   Konten khusus **Hari Jumat** (Surat Al-Kahfi & Hadits keutamaan Jumat).

## 🚀 Cara Penggunaan

Ada dua cara untuk menggunakan aplikasi ini, yaitu melalui versi online (paling mudah) atau dengan menjalankan secara lokal.

### 1. Versi Online (Rekomendasi)

Ini adalah cara termudah dan tidak memerlukan instalasi apa pun.

1.  Buka browser (Google Chrome, Firefox, dll) di perangkat (PC/Android TV Box) yang terhubung ke monitor masjid.
2.  Kunjungi tautan: **[Buka Aplikasi Yuk Sholat](https://yuksholat.pages.dev)**
3.  Tekan **F11** pada keyboard untuk masuk ke mode layar penuh (_fullscreen_).
4.  Lakukan pengaturan awal dengan mengklik ikon gerigi (⚙️) di pojok kanan atas. **Pastikan Anda terhubung ke internet saat melakukan pengaturan lokasi pertama kali.**
5.  Setelah selesai, aplikasi siap digunakan dan akan berjalan secara offline.

### 2. Menjalankan Secara Lokal (Untuk Pengembang)

Jika Anda ingin menjalankan aplikasi ini di komputer lokal untuk pengembangan atau modifikasi.

**Prasyarat:** Pastikan Anda memiliki [Node.js](https://nodejs.org/) (versi 18 atau lebih baru) terinstal.

1.  **Clone repository ini:**
    ```bash
    git clone https://github.com/aiprojek/jadwal-sholat-digital.git
    ```
2.  **Masuk ke direktori proyek:**
    ```bash
    cd jadwal-sholat-digital
    ```
3.  **Instal dependensi:**
    ```bash
    npm install
    ```
4.  **Jalankan server pengembangan:**
    ```bash
    npm run dev
    ```
    Ini akan menjalankan aplikasi dalam mode pengembangan. Buka browser dan akses alamat yang ditampilkan (biasanya `http://localhost:5173`).

5.  **Untuk membuat versi produksi:**
    ```bash
    npm run build
    ```
    Perintah ini akan membuat folder `dist` yang berisi file statis yang siap untuk di-deploy ke server web apa pun.

## ⚙️ Konfigurasi

Seluruh konfigurasi aplikasi dapat diakses melalui **ikon gerigi (⚙️)** di pojok kanan atas. Semua perubahan yang Anda simpan akan tersimpan secara permanen di `localStorage` browser, sehingga tidak akan hilang meskipun browser ditutup atau komputer dimatikan.

## 🤝 Kolaborasi Manusia & AI

Aplikasi ini merupakan contoh nyata dari kolaborasi antara kreativitas manusia dan kemampuan kecerdasan buatan (AI). Untuk transparansi, berikut adalah pembagian peran dalam proses pengembangannya:

-   **Peran Manusia (Pengembang/Arsitek Proyek):**
    -   **Visi dan Konsep Awal:** Memberikan ide dasar dan tujuan dari aplikasi.
    -   **Spesifikasi Fitur:** Menentukan fitur-fitur yang harus ada dan bagaimana cara kerjanya.
    -   **Pengujian dan Umpan Balik:** Melakukan pengujian fungsionalitas dan memberikan feedback untuk perbaikan.
    -   **Pengarahan Desain:** Memberikan arahan estetika, tata letak, dan pengalaman pengguna secara keseluruhan.

-   **Peran AI (Asisten Pemrograman):**
    -   **Penulisan Kode:** Menghasilkan sebagian besar kode sumber (React, TypeScript, CSS) berdasarkan permintaan.
    -   **Strukturisasi Proyek:** Membantu dalam menyusun struktur file dan komponen aplikasi.
    -   **Implementasi Logika Kompleks:** Menulis logika untuk fitur-fitur seperti perhitungan waktu, countdown, dan alur otomatis.
    -   **Optimasi dan Praktik Terbaik:** Menerapkan praktik-praktik pemrograman modern untuk memastikan kode bersih, efisien, dan responsif.

Kolaborasi ini memungkinkan ide-ide inovatif dapat diwujudkan dengan cepat, di mana manusia berfokus pada aspek kreatif dan fungsional, sementara AI mengakselerasi proses pengembangan teknis.

## 🛠️ Teknologi yang Digunakan

-   **Framework:** React dengan TypeScript
-   **Styling:** Tailwind CSS
-   **Build Tool:** Vite
-   **API Waktu Sholat:** [Al-Adhan API](https://aladhan.com/prayer-times-api)

## 🤝 Kontribusi

Kontribusi dari komunitas sangat kami harapkan untuk membuat aplikasi ini menjadi lebih baik! Jika Anda memiliki ide, laporan bug, atau ingin menambahkan fitur baru, jangan ragu untuk:

1.  Bergabung dengan grup diskusi kami di **[Telegram: AI Projek Community](https://t.me/aiprojek_community)**.
2.  Membuat **Issue** di repository ini.
3.  Membuat **Pull Request** dengan mengikuti langkah-langkah berikut:
    -   Fork repository ini.
    -   Buat branch baru (`git checkout -b fitur/nama-fitur-baru`).
    -   Lakukan perubahan dan commit (`git commit -m 'feat: Menambahkan fitur X'`).
    -   Push ke branch Anda (`git push origin fitur/nama-fitur-baru`).
    -   Buka Pull Request.

## ❤️ Dukungan

Aplikasi ini 100% gratis dan akan selalu begitu, dikembangkan dengan semangat sumber terbuka (_open-source_). Sebagai proyek independen, pengembangan dan pemeliharaan berkelanjutan didukung oleh kontribusi sukarela dari komunitas.

<a href="https://lynk.id/aiprojek/s/bvBJvdA" target="_blank">
  <img src="https://img.shields.io/badge/☕-Donasi-orange?style=for-the-badge&logo=buy-me-a-coffee" alt="Donasi">
</a>

## 📜 Lisensi

Proyek ini dilisensikan di bawah **GNU General Public License v3.0**. Lihat file `LICENSE` untuk detail lebih lanjut.