# Interviewed

Interviewed adalah aplikasi yang membantu pengguna memahami peluang karier mereka sebelum melamar pekerjaan.

Alih-alih hanya memberikan skor ATS, Interviewed bertindak seperti recruiter pribadi berbasis AI yang mengenal kandidat melalui CV, LinkedIn, dan percakapan singkat.

Pengguna cukup masuk menggunakan akun Google, mengunggah CV atau memasukkan tautan LinkedIn, lalu AI akan mulai mengenali pengalaman, keterampilan, dan proyek yang pernah dikerjakan.

Setelah itu, AI akan melakukan interview singkat layaknya recruiter sungguhan untuk menggali informasi yang mungkin belum tertulis di CV. Hasil percakapan tersebut digunakan untuk membentuk profil kandidat yang lebih lengkap.

Berdasarkan profil tersebut, sistem akan mencari lowongan pekerjaan yang relevan dan memberikan rekomendasi beserta alasan mengapa pekerjaan tersebut cocok untuk pengguna.

## Alur Penggunaan

1. Masuk menggunakan akun Google.
2. Unggah CV atau masukkan tautan LinkedIn.
3. AI membaca dan memahami profil pengguna.
4. AI melakukan interview singkat mengenai pengalaman dan portofolio.
5. Pengguna dapat berdiskusi dengan AI mengenai profil kariernya.
6. Sistem mencari lowongan pekerjaan yang sesuai.
7. Pengguna menerima rekomendasi pekerjaan beserta alasan kecocokannya.

## Tujuan

Interviewed dibuat untuk membantu pengguna:

- Mengenali kekuatan dan pengalaman yang dimiliki.
- Memahami bagaimana recruiter melihat profil mereka.
- Menemukan pekerjaan yang lebih sesuai.
- Mendapatkan arahan karier sebelum melamar pekerjaan.

Interviewed bukan pengganti recruiter atau jaminan diterima bekerja. Sistem ini merupakan simulasi berbasis AI yang bertujuan membantu pengguna mengambil keputusan karier dengan lebih percaya diri.

## Cara Menjalankan

### Prasyarat

| Tool           | Versi  | Cek                |
| -------------- | ------ | ------------------ |
| Node.js        | ≥ 20   | `node --version`   |
| pnpm           | ≥ 10   | `pnpm --version`   |
| Java JDK       | 21+    | `java -version`    |
| Maven          | 3.9+   | `mvn --version`    |
| Moon           | ≥ 2.3  | `moon --version`   |
| Docker Desktop | latest | `docker --version` |

### Opsi 1 — Moonrepo (direkomendasikan, paralel)

```bash
# 1. Nyalakan MySQL (sekali, background)
docker compose up mysql -d

# 2. Jalankan backend + frontend secara paralel
moon run :dev
```

Output:

- Backend: http://localhost:8080
- Frontend: http://localhost:5173

Task lain yang berguna:

```bash
moon run :dev          # dev mode: backend + frontend jalan paralel (hot reload)
moon run :start        # production mode: build semua dulu, lalu jalankan JAR + preview
moon run :build        # hanya build backend + frontend
moon run :test         # jalankan backend tests
moon run :lint         # lint frontend
moon run backend:dev   # hanya backend dev server
moon run frontend:dev  # hanya frontend dev (auto-install deps via pnpm)
moon run start:backend # jalankan backend dari JAR hasil build
moon run start:frontend# serve frontend dari dist/ via vite preview
```

### Mode Dev vs Production

- **Dev** (`moon run :dev`) — Spring Boot pakai `mvn spring-boot:run`, Vite pakai dev server dengan HMR. Source code edit → auto reload.
- **Production** (`moon run :start`) — Moon build JAR + `dist/` dulu, lalu jalanin `java -jar` + `vite preview`. Output lebih cepat, no reload.

### Opsi 2 — Docker Compose (full stack)

```bash
docker compose up -d --build
```

MySQL + backend + frontend otomatis nyala. Frontend di http://localhost:5173, API di http://localhost:8080.

### Opsi 3 — Manual (tanpa moon)

Terminal 1 — backend (pastikan MySQL sudah jalan):

```bash
cd backend
mvn spring-boot:run
```

Terminal 2 — frontend:

```bash
cd frontend
pnpm install
pnpm dev
```

### Environment

Salin `.env.example` ke `.env` lalu isi kredensial:

```bash
cp .env.example .env
```

Wajib diisi sebelum fitur AI/OAuth/Apify bisa dipakai: `OPENROUTER_API_KEY`, `APIFY_TOKEN`, `APIFY_LINKEDIN_PROFILE_ACTOR`.

MySQL otomatis di-setup via `docker compose up mysql -d`. Schema dijalankan oleh Flyway saat backend start.

### Catatan

- File CV yang bukan resume/kata kunci CV akan otomatis terdeteksi dan muncul warning banner di UI sebelum analisis AI.
- Frontend pakai Vite + React 19 + GSAP untuk animasi.
- Backend pakai Spring Boot 3.5 + Spring AI (OpenRouter) + Spring Data JPA.
