# Fitur: Automasi Session & Token Saat Registrasi

Dokumen ini berisi instruksi high-level untuk mengimplementasikan fitur pembuatan session token otomatis ketika user berhasil melakukan registrasi, menggunakan framework ElysiaJS dan Drizzle ORM.

## 1. Penambahan Schema Database
Perbarui file schema Drizzle (di `src/db/schema.ts`) dengan menambahkan tabel baru bernama `sessions`. Pastikan tabel tersebut memiliki struktur berikut:
- `id`: integer, auto increment (Primary Key)
- `token`: varchar(255), not null (akan diisi dengan UUID untuk token user yang login/registrasi)
- `user_id`: integer (Foreign Key yang merujuk/berelasi ke field id di tabel `users`)
- `created_at`: timestamp, default current_timestamp

Setelah tabel `sessions` didefinisikan, jalankan perintah dari Drizzle Kit untuk men-generate file migrasi dan jalankan migrasi tersebut ke database MySQL.

## 2. Pembaruan Service (Logic Bisnis)
Buka dan perbarui file `src/services/user-services.ts`:
- Lanjutkan dari logika yang sudah ada (pengecekan email duplikat dan penyimpanan user baru).
- Setelah user baru berhasil di-insert ke database, dapatkan ID dari user tersebut.
- Generate sebuah UUID (misalnya menggunakan fungsi bawaan `crypto.randomUUID()`).
- Simpan UUID tersebut beserta `user_id` ke dalam tabel `sessions`.
- Ubah nilai kembalian (return value) fungsi agar mengembalikan string token UUID tersebut.

## 3. Pembaruan Route (API Endpoint)
Buka dan perbarui file `src/routes/user-route.ts`:
- Endpoint `POST /api/users` tetap menerima Request Body dengan format JSON berikut:
  ```json
  {
    "name": "Salapink",
    "email": "salapink@localhost",
    "password": "rahasia"
  }
  ```
- **Pembaruan Handling Response:**
  - Jika proses **sukses**, endpoint harus mengembalikan response JSON berisi token yang didapat dari service:
    ```json
    { "data": "token-uuid-disini" }
    ```
  - Jika proses **gagal** (misal email sudah terdaftar), tetap kembalikan response error seperti biasa:
    ```json
    { "error": "email sudah terdaftar" }
    ```

## 4. Pengetesan
- Jalankan server ElysiaJS.
- Tes endpoint `POST /api/users` untuk memastikan bahwa ketika sukses, API membalas dengan token UUID (bukan pesan "OK" lagi).
- Pastikan data token tersebut juga masuk ke dalam tabel `sessions` di database MySQL dan berelasi dengan benar ke tabel `users`.
