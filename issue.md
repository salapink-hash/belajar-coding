# Panduan Implementasi: Fitur Login User

Dokumen ini berisi panduan tingkat tinggi (high-level) untuk mengimplementasikan fitur Login User. Panduan ini dirancang untuk dieksekusi oleh junior programmer atau AI assistant.

## 1. Pembaruan Skema Database

Lakukan pembaruan pada skema database Anda. Pastikan tabel `users` sudah ada, kemudian tambahkan tabel `sessions` dengan spesifikasi berikut:

- **Tabel `users`**: (Tabel eksisting)
- **Tabel `sessions`**: Buat tabel baru dengan spesifikasi kolom:
  - `id`: integer, auto increment (Primary Key)
  - `token`: varchar(255), not null (berisi UUID untuk token user yang login)
  - `user_id`: integer (Foreign Key yang berelasi ke tabel `users`)
  - `created_at`: timestamp, dengan default `current_timestamp`

*Langkah Eksekusi:* Tambahkan definisi tabel tersebut ke dalam skema ORM Anda, generate file migrasi, lalu jalankan migrasi ke database.

## 2. Struktur Direktori dan File

Aplikasi ini menggunakan struktur pemisahan antara *routes* dan *services*. Pekerjaan Anda akan difokuskan pada dua direktori utama di dalam folder `src/`:
- **`src/routes/`**: Tempat mendefinisikan *routing* framework (ElysiaJS). Anda akan bekerja pada file dengan format nama `user-route.ts`.
- **`src/services/`**: Tempat menyimpan seluruh *logic* bisnis aplikasi. Anda akan bekerja pada file dengan format nama `user-services.ts`.

## 3. Implementasi Logic Bisnis (Services)

Di dalam file `src/services/user-services.ts`, tambahkan *logic* baru untuk menangani proses otentikasi login.
Langkah-langkah eksekusi secara garis besar:
1. Terima data kredensial dari request (seperti email dan password).
2. Cari data *user* di tabel `users` berdasarkan email tersebut.
3. Lakukan pengecekan kecocokan password. Jika password tidak cocok atau *user* tidak ditemukan, hasilkan (throw) pesan error.
4. Jika login valid, *generate* sebuah UUID baru untuk dijadikan token sesi login.
5. Simpan (insert) UUID tersebut ke dalam tabel `sessions` beserta `user_id` yang bersangkutan.
6. Kembalikan (return) token UUID tersebut agar bisa digunakan oleh *routes*.

## 4. Implementasi API Endpoint (Routes)

Di dalam file `src/routes/user-route.ts`, buat *endpoint* API baru untuk menerima request login dari *client*.

- **Endpoint:** `POST /api/user/login`
- **Request Body (Contoh Payload):**
  ```json
  {
    "name": "Salapink",
    "email": "salapink@localhost",
    "password": "rahasia"
  }
  ```
- **Response Body (Jika Sukses):**
  ```json
  {
    "data": "token yang di hasilkan"
  }
  ```
- **Response Body (Jika Error):**
  ```json
  {
    "error": "email atau password salah"
  }
  ```

*Langkah Eksekusi:* Daftarkan *endpoint* ini dan hubungkan dengan fungsi dari `user-services.ts` yang dibuat pada tahap 3. Pastikan Anda menangkap (catch) error dari *service* untuk mengembalikan pesan "email atau password salah" sesuai ketentuan di atas.

## 5. Tahapan Pengetesan

Setelah diimplementasikan, verifikasi kode Anda dengan langkah berikut:
- Kirim HTTP POST request ke `/api/user/login` dengan data *user* yang valid.
- Pastikan response yang diterima berupa JSON sukses berisi token.
- Cek tabel `sessions` di database untuk memastikan *record* token dan relasi `user_id` benar-benar terbuat.
- Lakukan request ulang dengan password yang salah dan pastikan API mengembalikan JSON berisi informasi error.
