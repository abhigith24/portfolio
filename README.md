# Portfolio Website

A modern, fully free-tier portfolio website with a secure admin dashboard.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Icons | Lucide React |
| Animations | Framer Motion |
| Database | Firebase Firestore |
| Auth | Firebase Authentication |
| Storage | Supabase Storage |
| Forms | Web3Forms |
| Analytics | Google Analytics 4 |

---

## Setup Guide

### 1. Prerequisites
- Node.js 18+ installed
- A Firebase project
- A Supabase project

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use existing)
3. Enable **Firestore Database** (start in test mode, deploy rules later)
4. Enable **Authentication** → **Email/Password** provider
5. Go to **Project Settings** → **General** → **Your apps** → Add a **Web app**
6. Copy the Firebase config values

#### Create Admin User
1. Go to **Authentication** → **Users** → **Add user**
2. Enter your admin email and password
3. This will be your login for `/admin`

#### Deploy Firestore Rules
```bash
npm install -g firebase-tools
firebase login
firebase init firestore  # select your project, use existing firestore.rules
firebase deploy --only firestore:rules
```

### 3. Supabase Setup

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project
3. Go to **Storage** → Create these **public** buckets:
   - `profile`
   - `projects`
   - `resumes`
   - `certifications`
4. For each bucket, go to **Policies** and add:
   - **SELECT**: Allow for `anon` role (public reads)
   - **INSERT/UPDATE/DELETE**: Allow for `authenticated` role (or use no RLS for simplicity since admin uploads go through your app)
5. Copy your **Project URL** and **anon public key** from **Settings** → **API**

### 4. Web3Forms Setup

1. Go to [web3forms.com](https://web3forms.com/)
2. Enter your email to get a free API access key
3. Copy the access key

### 5. Google Analytics Setup (Optional)

1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a property for your site
3. Get your **Measurement ID** (format: `G-XXXXXXXXXX`)

### 6. Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_WEB3FORMS_KEY=your-access-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 7. Install & Run

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` for the portfolio and `http://localhost:3000/admin/login` for the admin panel.

---

## Deployment to Vercel

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/portfolio.git
git push -u origin main
```

### 2. Deploy on Vercel
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Vercel auto-detects Next.js
4. Add all environment variables from `.env.local` to **Settings** → **Environment Variables**
5. Update `NEXT_PUBLIC_SITE_URL` to your Vercel domain
6. Deploy!

### 3. Post-Deployment
- Update `robots.txt` sitemap URL to your actual domain
- Update Firebase authorized domains (Authentication → Settings)
- Update Supabase CORS if needed

---

## Admin Panel Features

| Feature | Route |
|---------|-------|
| Dashboard | `/admin` |
| Profile & Photo | `/admin/profile` |
| Projects CRUD | `/admin/projects` |
| Skills CRUD | `/admin/skills` |
| Experience CRUD | `/admin/experience` |
| Certifications CRUD | `/admin/certifications` |
| Resume Management | `/admin/resumes` |
| Social Links | `/admin/social` |
| Contact Messages | `/admin/messages` |
| SEO & Settings | `/admin/settings` |

---

## Firestore Collections

| Collection | Description |
|-----------|-------------|
| `users` | User profile (document ID: `main`) |
| `projects` | Portfolio projects |
| `skills` | Technical skills |
| `experiences` | Work experience / internships |
| `certifications` | Professional certifications |
| `resumes` | Resume PDF files |
| `socialLinks` | Social media links |
| `contactMessages` | Contact form submissions |
| `settings` | Site settings (documents: `seo`, `general`) |

---

## License

MIT
