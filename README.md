# LeadDesk Mini

A production-ready full-stack **MERN** CRM for capturing and managing leads.

> Built for [Digital Heroes](https://digitalheroesco.com) Training Task

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + Tailwind CSS + Framer Motion |
| Backend | Node.js + Express.js |
| Database | MongoDB Atlas + Mongoose |
| Auth | JWT + bcryptjs + HttpOnly Cookies |
| Forms | React Hook Form + Zod |
| Icons | Lucide React |

---

## Features

- 🌐 **Public Landing Page** — Hero, Features, Why Us, CTA, Lead Capture Form
- 🔐 **Real JWT Authentication** — bcrypt, HttpOnly cookies, protected routes
- 📊 **Admin Dashboard** — Search, filter, status toggle, delete, pagination
- 📋 **Lead Detail Panel** — Slide-over view with full message
- 🌙 **Dark / Light Mode** — Persisted in localStorage
- 📱 **Fully Responsive** — Mobile-first layout
- 🔔 **Toast Notifications** — Success, error, info
- ⚡ **Loading Skeletons** — Graceful loading states
- 🛡️ **Rate Limiting** — IP-based protection on form submissions

---

## Local Development

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### 1. Clone & Install

```bash
git clone https://github.com/priyanshuroshan/leaddesk.git
cd leaddesk
npm install:all
```

### 2. Configure Environment

```bash
cp server/.env.example server/.env
```

Edit `server/.env`:

```env
PORT=5001
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/leaddesk
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development

ADMIN_NAME=Admin
ADMIN_EMAIL=admin@leaddesk.com
ADMIN_PASSWORD=Admin@123456
```

### 3. Seed Admin Account

```bash
npm run seed
```

### 4. Run Development Servers

```bash
npm run dev
```

- **Client** → http://localhost:5173
- **API** → http://localhost:5001
- **Admin Login** → http://localhost:5173/login

---

## Deployment on Vercel

### 1. Push to GitHub

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Import on Vercel

1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Import your GitHub repo `priyanshuroshan/leaddesk`
3. **Root Directory**: Leave as `/` (root)
4. Vercel will auto-detect the `vercel.json` config

### 3. Set Environment Variables on Vercel

In your Vercel project → **Settings → Environment Variables**, add:

| Key | Value |
|---|---|
| `MONGO_URI` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | A strong random secret key |
| `JWT_EXPIRES_IN` | `7d` |
| `CLIENT_URL` | Your Vercel deployment URL (e.g. `https://leaddesk.vercel.app`) |
| `NODE_ENV` | `production` |

### 4. Re-seed Admin on Atlas

After deployment, run locally (Atlas is already connected):

```bash
cd server && npm run seed
```

---

## API Endpoints

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/leads` | Public | Submit a lead |
| GET | `/api/leads` | Admin | List all leads (search, filter, paginate) |
| PATCH | `/api/leads/:id` | Admin | Update lead status |
| DELETE | `/api/leads/:id` | Admin | Delete a lead |
| POST | `/api/auth/login` | Public | Admin login |
| POST | `/api/auth/logout` | Admin | Logout |
| GET | `/api/auth/me` | Admin | Get current user |
| GET | `/api/health` | Public | Health check |

---

## Lead Status Flow

```
New → Contacted → Closed → New (cycle)
```

---

## Default Admin Credentials

```
Email:    admin@leaddesk.com
Password: Admin@123456
```

> ⚠️ Change these in production via `.env` before seeding.

---

## Folder Structure

```
leaddesk/
├── server/
│   ├── config/         # DB connection
│   ├── controllers/    # Route handlers
│   ├── middleware/     # Auth, validation, error handler
│   ├── models/         # Mongoose schemas
│   ├── routes/         # Express routers
│   ├── utils/          # Seed script
│   └── index.js        # App entry point
├── client/
│   └── src/
│       ├── components/ # UI + layout components
│       ├── context/    # Auth + Theme context
│       ├── hooks/      # useLeads, useToast
│       ├── pages/      # Landing, Login, Dashboard, 404
│       └── services/   # Axios API instance
├── vercel.json         # Vercel deployment config
└── package.json        # Root monorepo scripts
```

---

Built with ❤️ for [Digital Heroes](https://digitalheroesco.com)
