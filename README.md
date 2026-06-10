# NyalakanPC - Remote Wake-on-LAN for ESP01

Sistem untuk menyalakan PC dari jaringan berbeda (Remote WOL) menggunakan ESP01 yang terhubung ke jaringan kampus dengan Captive Portal.

## Fitur Utama
1. **Remote Access**: Menggunakan protokol MQTT (HiveMQ) sehingga bisa diakses dari mana saja tanpa setting Port Forwarding atau VPN.
2. **Captive Portal Login**: Otomatis login ke `hs.univet.id` dengan fitur rotasi akun (KEPEG022, VIP01-09).
3. **Modern Dashboard**: UI premium dengan Glassmorphism, responsif di HP maupun Laptop.
4. **Live Terminal**: Pantau log detail dari ESP01 secara real-time langsung dari dashboard web.
5. **Multi Device**: Tambahkan banyak PC/Device dengan MAC address yang berbeda.

## Persiapan Firmware (ESP01)
1. Buka file `firmware/firmware.ino` menggunakan Arduino IDE.
2. Install library berikut melalui Library Manager:
   - `WakeOnLan` oleh GitHub/a-ready
   - `PubSubClient` oleh Nick O'Leary
3. Pilih Board: **Generic ESP8266 Module**.
4. Flash ke ESP01 kamu.

## Jalankan Dashboard (Lokal)
1. Pastikan Node.js sudah terinstall.
2. Masuk ke folder `dashboard`.
3. Jalankan perintah:
   ```bash
   npm install
   npm run dev
   ```
4. Buka URL yang muncul di browser.

## Deployment (Online)
Agar bisa diakses dari device lain secara online:
1. Upload folder `dashboard` ke platform seperti **Vercel**, **Netlify**, atau **GitHub Pages**.
2. Pastikan file `App.jsx` menggunakan `wss://` untuk koneksi MQTT yang aman.

## Struktur Project
- `firmware/`: Kode C++ untuk ESP01.
- `dashboard/`: Kode React untuk interface user.
- `implementation_plan.md`: Detail arsitektur sistem.

---
**Catatan Keamanan**: 
Ganti `deviceId` di `firmware.ino` dan `App.jsx` dengan string yang unik dan rahasia agar orang lain tidak bisa mengontrol device kamu.
