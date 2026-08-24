# Panduan Implementasi: Fitur Dapatkan User Saat Ini (Get Current User)

Dokumen ini berisi panduan tingkat tinggi (high-level) untuk mengimplementasikan fitur pengambilan data profil user yang sedang login. Panduan ini dirancang untuk dieksekusi oleh junior programmer atau AI assistant.

## 1. Pemahaman Arsitektur & Database

Aplikasi ini menggunakan otentikasi berbasis token. Token autentikasi klien harus dikirimkan dalam HTTP Header. Pastikan query Anda nantinya mencocokkan token ini dengan record yang valid di dalam database (biasanya berelasi melalui tabel otentikasi/sesi atau langsung di tabel users, sesuai dengan skema yang berjalan).

## 2. Struktur Direktori dan File

Fokuskan pekerjaan pada dua file berikut di dalam folder `src/`:
- **`src/routes/`**: Untuk mendefinisikan *routing* API (kerjakan pada `user-route.ts`).
- **`src/services/`**: Untuk menangani proses validasi dan query database (kerjakan pada `user-services.ts`).

## 3. Implementasi Logic Bisnis (Services)

Di dalam file `src/services/user-services.ts`, tambahkan fungsi baru (misal: `getCurrentUser`) untuk menangani logika pengambilan data profil.
Langkah-langkah eksekusi secara garis besar:
1. Fungsi menerima satu parameter berupa string `token`.
2. Lakukan pencarian (query) ke database untuk mencari token tersebut dan temukan data *user* yang berelasi dengannya.
3. Jika data *user* tidak ditemukan atau token tidak valid, hasilkan (throw) pesan error (yang nantinya ditangkap sebagai `Unauthorized`).
4. Jika valid, kembalikan (return) sebuah objek yang hanya berisi profil user dengan properti: `id`, `name`, `email`, dan `created_at`.

## 4. Implementasi API Endpoint (Routes)

Di dalam file `src/routes/user-route.ts`, buat *endpoint* API baru.

- **Endpoint:** `GET /api/user/current`
- **Headers:**
  - `Authorization: Bearer <token>`
- **Response Body (Jika Sukses):**
  ```json
  {
    "data": {
      "id": 1,
      "name": "salapink",
      "email": "salapink@localhost",
      "created_at": "timestamp"
    }
  }
  ```
- **Response Body (Jika Error):**
  ```json
  {
    "error": "Unauthorized"
  }
  ```

*Langkah Eksekusi:*
1. Buat *route handler* berjenis GET.
2. Ambil nilai header `Authorization` dari request.
3. Ekstrak *token string* (misalnya dengan membuang awalan "Bearer "). Jika token kosong, langsung kembalikan pesan error "Unauthorized".
4. Panggil fungsi *service* yang telah dibuat pada Langkah 3 dengan token tersebut.
5. Tangkap error (catch) jika ada, dan set HTTP status (disarankan 401) lalu kembalikan format error `{"error": "Unauthorized"}`.

## 5. Tahapan Pengetesan

Lakukan verifikasi setelah kode selesai diimplementasikan:
- Jalankan server lokal.
- Lakukan request HTTP GET ke `/api/user/current` menyertakan *header* `Authorization` berisi token valid. Pastikan profil user berhasil dikembalikan.
- Ulangi request tanpa *header* atau menggunakan token acak/salah, lalu pastikan API mengembalikan JSON error `Unauthorized` dengan HTTP status yang tepat.
