# Belajar Coding - ElysiaJS + Bun + Drizzle + MySQL

Project backend API menggunakan **Bun**, **ElysiaJS**, **Drizzle ORM**, dan **MySQL**.

## Tech Stack
- **Runtime:** [Bun](https://bun.sh)
- **Web Framework:** [ElysiaJS](https://elysiajs.com)
- **ORM:** [Drizzle ORM](https://orm.drizzle.team)
- **Database:** MySQL (driver `mysql2`)
- **Security:** `bcryptjs` (Password hashing)

## Struktur Project
```text
├── drizzle/              # Folder migrasi database SQL
├── src/
│   ├── db/
│   │   ├── index.ts      # Koneksi database MySQL dengan Drizzle
│   │   └── schema.ts     # Definisi schema/tabel (users)
│   ├── routes/
│   │   └── user-route.ts # Routing API ElysiaJS
│   ├── services/
│   │   └── user-services.ts # Logic bisnis aplikasi
│   └── index.ts          # Entry point server ElysiaJS
├── .env                  # Variabel environment (koneksi DB, port)
├── .env.example          # Contoh variabel environment
├── drizzle.config.ts     # Konfigurasi Drizzle Kit
├── package.json          # Dependencies & npm scripts
└── tsconfig.json         # Konfigurasi TypeScript
```

## Setup & Menjalankan Project

### 1. Install Dependencies
```bash
bun install
```

### 2. Konfigurasi Database (.env)
Sesuaikan variabel koneksi MySQL di file `.env`:
```env
DATABASE_URL="mysql://root:password@localhost:3306/belajar_coding"
PORT=3000
```

### 3. Database Migration (Drizzle Kit)
- **Generate migrasi baru**:
  ```bash
  bun run db:generate
  ```
- **Push migrasi langsung ke database**:
  ```bash
  bun run db:push
  ```
- **Drizzle Studio (Database GUI visual)**:
  ```bash
  bun run db:studio
  ```

### 4. Menjalankan Server
- **Mode Development (Auto reload)**:
  ```bash
  bun run dev
  ```
- **Mode Production**:
  ```bash
  bun run start
  ```

## Endpoints Tersedia
- `GET /` : Pesan sambutan server
- `GET /health` : Health check status
- `POST /api/users` : Registrasi user baru
  - **Body**:
    ```json
    {
      "name": "Salapink",
      "email": "salapink@localhost",
      "password": "rahasia"
    }
    ```
  - **Success Response (200 OK)**:
    ```json
    {
      "data": "OK"
    }
    ```
  - **Error Response (400 Bad Request)**:
    ```json
    {
      "error": "email sudah terdaftar"
    }
    ```
