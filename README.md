# 🎫 Event Ticketing System

Sistem penjualan tiket event full-stack dengan AI Agent berbasis Model Context Protocol (MCP). Dibangun sebagai project pembelajaran untuk mendalami konsep **concurrency handling**, **status machine**, **JPQL aggregation**, **rate limiting**, dan **AI agent integration** dalam konteks aplikasi backend yang nyata.

---

## 📋 Daftar Isi

- [Gambaran Umum](#-gambaran-umum)
- [Tech Stack](#-tech-stack)
- [Arsitektur Sistem](#-arsitektur-sistem)
- [Domain Model](#-domain-model)
- [Konsep Teknis yang Dipelajari](#-konsep-teknis-yang-dipelajari)
- [Struktur Repository](#-struktur-repository)
- [Cara Setup](#-cara-setup)
- [API Documentation](#-api-documentation)
- [Fitur Lengkap](#-fitur-lengkap)
- [Known Limitations](#-known-limitations)
- [Pengembangan Selanjutnya](#-pengembangan-selanjutnya)

---

## 🌐 Gambaran Umum

Event Ticketing System terdiri dari tiga komponen utama yang bekerja bersama:

| Komponen | Teknologi | Deskripsi |
|---|---|---|
| **Backend API** | Spring Boot 3.x | REST API utama — auth, event, order, tiket, laporan |
| **Frontend** | Next.js 15 + TypeScript | UI publik + dashboard admin |
| **MCP Agent** | Python FastAPI + FastMCP | AI agent berbahasa natural untuk interaksi dengan sistem |

---

## 🛠️ Tech Stack

### Backend
| Kategori | Teknologi |
|---|---|
| Bahasa | Java 21 |
| Framework | Spring Boot 3.5.x |
| Database | PostgreSQL |
| ORM | Spring Data JPA (Hibernate 6) |
| Security | Spring Security + JWT (JJWT 0.12.x) |
| Rate Limiting | Bucket4j (Token Bucket Algorithm) |
| Build Tool | Maven |
| Library | Lombok |

### Frontend
| Kategori | Teknologi |
|---|---|
| Framework | Next.js 15 (App Router) |
| Bahasa | TypeScript |
| Styling | Tailwind CSS |
| Data Fetching | TanStack Query (React Query) |
| Runtime | Bun |
| QR Code | qrcode.react + html5-qrcode |

### MCP Agent
| Kategori | Teknologi |
|---|---|
| MCP Server | Python 3.11+, FastMCP |
| MCP Client | Python, FastAPI, AsyncOpenAI |
| LLM | OpenRouter (OpenAI-compatible, tool calling) |

---

## 🏗️ Arsitektur Sistem

```
┌─────────────────────────────────────────────────────────┐
│                    Next.js Frontend                      │
│         (Public Pages + Admin Dashboard)                 │
└────────────────────┬───────────────┬────────────────────┘
                     │               │
              REST API          POST /chat
              + JWT             + JWT token
                     │               │
                     ▼               ▼
┌────────────────────┐   ┌──────────────────────────────┐
│  Spring Boot API   │   │     MCP Client (FastAPI)     │
│                    │   │                              │
│  • Auth + JWT      │   │  Tool-calling loop           │
│  • Event CRUD      │   │  + OpenRouter LLM            │
│  • Order + Lock    │◄──│                              │
│  • Tiket + QR      │   │         │ stdio              │
│  • Laporan JPQL    │   │         ▼                    │
│  • Rate Limiting   │   │  MCP Server (FastMCP)        │
└────────────────────┘   │  7 registered tools          │
         │               └──────────────────────────────┘
         ▼
    PostgreSQL
```

### Alur MCP Agent per Request

```
1. Frontend kirim pesan user + JWT token ke MCP Client
2. MCP Client jalankan tool-calling loop bersama LLM via OpenRouter
3. LLM putuskan tool mana yang perlu dipanggil
4. MCP Client inject token lalu kirim ke MCP Server via stdio
5. MCP Server eksekusi tool → panggil Spring Boot REST API dengan Bearer token
6. Hasil tool dikirim balik ke LLM untuk diformat jadi respons natural
7. Respons final dikembalikan ke frontend
```

> Token JWT tidak pernah disimpan di server MCP — hanya mengalir per request dan disembunyikan dari schema tools yang dilihat AI.

---

## 🗂️ Domain Model

```
User ──< Order ──< OrderItem >── TiketKategori >── Event
                      │
                      └──< Tiket
```

| Entity | Field Utama |
|---|---|
| `User` | id, nama, email, password, role (`USER`/`ADMIN`) |
| `Event` | id, nama, deskripsi, lokasi, tanggal, waktuMulai, waktuSelesai, status |
| `TiketKategori` | id, nama, harga, kuota, terjual, event_id |
| `Order` | id, kodeOrder, tanggalOrder, totalHarga, status, user_id |
| `OrderItem` | id, jumlah, hargaSatuan, order_id, tiketKategori_id |
| `Tiket` | id, kodeTiket (unik), status, orderItem_id, user_id |

---

## 🎓 Konsep Teknis yang Dipelajari

### 1. Concurrency Handling — Pessimistic Lock

Mencegah oversold tiket saat banyak user memesan secara bersamaan menggunakan `PESSIMISTIC_WRITE` lock di level database:

```java
@Lock(LockModeType.PESSIMISTIC_WRITE)
@Query("SELECT t FROM TiketKategori t WHERE t.id = :id")
TiketKategori findByIdWithLock(UUID id);
```

Dikombinasikan dengan `@Transactional` agar seluruh proses bersifat atomik — jika ada langkah yang gagal, semua perubahan di-rollback.

### 2. Status Machine

Tiga entity punya transisi status yang divalidasi ketat:

```
Event:  DRAFT ──publish──► PUBLISHED ──cancel──► CANCELLED
Order:  PENDING ──pay──► PAID
        PENDING ──cancel──► CANCELLED (kuota dikembalikan)
Tiket:  ACTIVE ──checkin──► USED
        ACTIVE ──(order cancel)──► CANCELLED
```

### 3. Cascade Operation

Satu `createOrder` otomatis men-generate seluruh chain entity:

```
1 Order → N OrderItem → N Tiket (dengan kode unik per tiket)
```

### 4. JPQL Aggregation dengan Constructor Expression

Laporan penjualan dihitung langsung di database — hanya menghitung order `PAID`:

```java
@Query("""
    SELECT new com.example.event_ticketing.dto.response.KategoriSummaryResponse(
        oi.tiketKategori.nama,
        SUM(oi.jumlah),
        SUM(oi.jumlah * oi.hargaSatuan)
    )
    FROM OrderItem oi
    WHERE oi.tiketKategori.event.id = :eventId
    AND oi.order.status = 'PAID'
    GROUP BY oi.tiketKategori.nama
""")
```

### 5. Rate Limiting — Bucket4j Token Bucket

Dua strategi berbeda berdasarkan konteks:

**Auth endpoints** — berdasarkan IP Address (mencegah brute-force):

| Endpoint | Limit |
|---|---|
| `POST /api/auth/login` | 5 request / menit |
| `POST /api/auth/register` | 3 request / menit |

**Transaction endpoints** — berdasarkan User UUID (fairness per user):

| Endpoint | Limit |
|---|---|
| `POST /api/orders` | 5 request / menit |
| `PATCH /api/orders/{id}/pay` | 5 request / menit |
| `PATCH /api/orders/{id}/cancel` | 5 request / menit |

Response saat limit tercapai:
```
HTTP 429 Too Many Requests
Retry-After: <seconds>
X-RateLimit-Remaining: 0
```

### 6. MCP AI Agent Integration

AI agent dengan tool calling — LLM memutuskan sendiri tool mana yang dipanggil berdasarkan pesan user. Max 6 iterasi per request untuk mencegah infinite loop. Parameter `token` disembunyikan dari schema tools sehingga AI tidak pernah tahu keberadaan token dan tidak akan memintanya ke user.

---

## 📁 Struktur Repository

```
event-ticketing/
├── backend/
│   └── src/main/java/com/example/event_ticketing/
│       ├── controllers/
│       ├── services/
│       ├── repositories/
│       ├── models/
│       │   └── enums/
│       ├── dto/
│       │   ├── request/
│       │   └── response/
│       ├── security/
│       ├── exception/
│       └── utils/
│
├── frontend/
│   └── src/
│       ├── app/
│       │   ├── (auth)/          # Login, Register
│       │   ├── (public)/        # Halaman publik + Navbar
│       │   └── (admin)/         # Dashboard admin + Sidebar
│       ├── components/
│       ├── hooks/
│       ├── services/
│       ├── types/
│       │   ├── enum/
│       │   ├── request/
│       │   └── response/
│       ├── context/
│       ├── lib/
│       └── utils/
│
└── mcp/
    ├── server/
    │   ├── server.py            # FastMCP — register tools
    │   ├── api_client.py        # HTTP client ke Spring Boot
    │   └── schemas.py
    └── client/
        ├── main.py              # FastAPI endpoint POST /chat
        ├── client.py            # Tool-calling loop
        └── schemas.py
```

---

## ⚙️ Cara Setup

### Prerequisites
- Java 21, Maven
- PostgreSQL
- Node.js 18+ / Bun
- Python 3.11+

### 1. Backend

```bash
cd backend

# Buat database
psql -U postgres -c "CREATE DATABASE event_ticketing;"
```

Isi `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/event_ticketing
spring.datasource.username=YOUR_USERNAME
spring.datasource.password=YOUR_PASSWORD
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
app.jwt.secret=GANTI_DENGAN_SECRET_KEY_PANJANG_MIN_32_KARAKTER
app.jwt.expiration=86400000
```

```bash
mvn spring-boot:run
# Berjalan di http://localhost:8080
```

### 2. Frontend

```bash
cd frontend
bun install
```

Isi `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
API_URL=http://localhost:8080/api
```

```bash
bun dev
# Berjalan di http://localhost:3000
```

### 3. MCP Agent

```bash
cd mcp
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Isi `.env`:
```env
API_BASE_URL=http://localhost:8080
FRONTEND_BASE_URL=http://localhost:3000
OPENROUTER_API_KEY=your_openrouter_api_key
OPENROUTER_MODEL=your_model_name
```

> Pilih model yang support tool calling di [openrouter.ai/models](https://openrouter.ai/models) dengan filter `supported_parameters=tools`.

```bash
# Jalankan MCP Client
cd client
uvicorn main:app --reload --port 8001

# Jalankan MCP Server (untuk testing via Inspector)
cd server
python server.py
```

---

## 📡 API Documentation

Semua response mengikuti format standar:
```json
{
  "success": true,
  "message": "...",
  "data": { ... }
}
```

### Auth
| Method | Endpoint | Akses | Keterangan |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register (limit: 3/menit per IP) |
| POST | `/api/auth/login` | Public | Login (limit: 5/menit per IP) |

### Event
| Method | Endpoint | Akses | Keterangan |
|---|---|---|---|
| GET | `/api/events` | Public | List semua event |
| GET | `/api/events/{id}` | Public | Detail event |
| POST | `/api/events` | ADMIN | Buat event (status DRAFT) |
| PUT | `/api/events/{id}` | ADMIN | Update event (hanya DRAFT) |
| PATCH | `/api/events/{id}/publish` | ADMIN | Publikasikan event |
| PATCH | `/api/events/{id}/cancel` | ADMIN | Batalkan event |
| DELETE | `/api/events/{id}` | ADMIN | Hapus event (hanya DRAFT) |

### Kategori Tiket
| Method | Endpoint | Akses | Keterangan |
|---|---|---|---|
| GET | `/api/events/{eventId}/tiket-kategori` | Public | List kategori tiket |
| POST | `/api/events/{eventId}/tiket-kategori` | ADMIN | Tambah kategori |
| PUT | `/api/tiket-kategori/{id}` | ADMIN | Update kategori |
| DELETE | `/api/tiket-kategori/{id}` | ADMIN | Hapus kategori |

### Order
| Method | Endpoint | Akses | Keterangan |
|---|---|---|---|
| POST | `/api/orders` | USER | Buat order (limit: 5/menit per user) |
| GET | `/api/orders` | USER | List order milik sendiri |
| GET | `/api/orders/{id}` | USER | Detail order |
| PATCH | `/api/orders/{id}/pay` | USER | Bayar order |
| PATCH | `/api/orders/{id}/cancel` | USER | Batalkan order |

### Tiket
| Method | Endpoint | Akses | Keterangan |
|---|---|---|---|
| GET | `/api/tikets` | USER | List tiket milik sendiri |
| PATCH | `/api/tikets/checkin` | ADMIN | Check-in via kode tiket |

### Laporan
| Method | Endpoint | Akses | Keterangan |
|---|---|---|---|
| GET | `/api/laporan/events/{eventId}` | ADMIN | Sales summary per event |

### MCP Agent
| Method | Endpoint | Port | Keterangan |
|---|---|---|---|
| POST | `/chat` | 8001 | Chat dengan AI agent |

Request body:
```json
{
  "message": "cari event chelsea dan tampilkan tiket yang tersedia",
  "token": "eyJhbGci...",
  "conversation_history": []
}
```

### MCP Tools
| Tool | Deskripsi |
|---|---|
| `get_events_list` | Ambil daftar event ter-publish |
| `search_event` | Cari event berdasarkan nama |
| `get_event_availability` | Detail informasi sebuah event |
| `get_ticket_category_event` | Daftar kategori tiket + sisa kuota |
| `create_order` | Buat order tiket baru |
| `check_order_status` | Cek status order berdasarkan ID |
| `get_my_orders` | Ambil semua order milik user saat ini |

---

## ✨ Fitur Lengkap

### Publik
- Halaman event dengan bento grid layout dan search realtime
- Detail event dengan info lengkap dan daftar kategori tiket
- QR Code tiket yang bisa ditampilkan dan discan

### User
- Register & login dengan JWT
- Beli tiket — multi-kategori dalam satu order
- Filter order berdasarkan status (PENDING / PAID / CANCELLED)
- Bayar dan batalkan order
- Lihat koleksi tiket dengan QR code per tiket
- Chat dengan AI agent menggunakan bahasa natural

### Admin
- Kelola event (create, edit, publish, cancel, delete) via tabel + modal
- Kelola kategori tiket per event
- Check-in tiket via input manual atau QR scanner kamera
- Laporan penjualan per event dengan breakdown per kategori tiket

---

## ⚠️ Known Limitations

**Rate Limiting — Stateless per Instance**
Bucket4j menyimpan bucket di memory aplikasi. Pada deployment horizontal (multiple instance), setiap instance memiliki bucket terpisah sehingga user bisa bypass limit dengan request yang terdistribusi. Solusi untuk production: integrasi Bucket4j dengan Redis sebagai distributed store.

**Tidak Ada Gambar Event**
Entity `Event` tidak memiliki field gambar. Tampilan menggunakan gradient warna yang di-generate otomatis berdasarkan ID event. Untuk production, dapat ditambahkan field `gambarUrl` dengan Cloudinary sebagai storage.

**MCP Agent — Stateless Conversation**
Conversation history harus dikirim ulang setiap request dari client karena belum ada session management di level MCP server.

---

## 🚀 Pengembangan Selanjutnya

- [ ] Gambar event via Cloudinary URL
- [ ] Pagination pada endpoint list event dan order
- [ ] Filter laporan berdasarkan rentang tanggal
- [ ] Notifikasi email/WhatsApp saat order berhasil dibuat atau dibayar
- [ ] Bucket4j + Redis untuk rate limiting yang distributed
- [ ] Role `STAFF` khusus untuk operasional check-in
- [ ] Unit test untuk `OrderService` (concurrency logic)
- [ ] Deploy — backend ke Railway, frontend ke Vercel
- [ ] Model fallback di MCP agent saat model OpenRouter rate-limited

---

## 👤 Author

Dikembangkan oleh **Aldino Khalifah** sebagai project pembelajaran backend development, frontend integration, dan AI agent architecture.