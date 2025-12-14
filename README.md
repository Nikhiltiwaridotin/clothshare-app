# 👔👗 ClothShare

> **Rent clothes from your campus neighbors** - A peer-to-peer fashion rental platform for college students

[![Live Demo](https://img.shields.io/badge/Demo-Live-brightgreen?style=for-the-badge)](https://clothshare-app.vercel.app)
[![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5-purple?style=flat-square&logo=vite)](https://vitejs.dev)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-green?style=flat-square&logo=supabase)](https://supabase.com)

---

## 🌟 Features

### For Renters
- 🔍 **Browse Items** - Search and filter by category, size, price, and distance
- 📍 **Location-Based** - Find clothes near your campus
- 💳 **Secure Payments** - Razorpay integration for safe transactions
- ❤️ **Save Favorites** - Bookmark items for later
- 📱 **Mobile Friendly** - Fully responsive design

### For Listers
- 📸 **Easy Listing** - Drag & drop image upload
- 💰 **Set Your Price** - Daily/weekly rental rates
- 📊 **Dashboard** - Track your listings and requests
- ⭐ **Reviews** - Build your reputation

---

## 🎨 Design System

Built with a **70-20-10 color rule** for a modern, professional look:

| Role | Color | Usage |
|------|-------|-------|
| **70% Neutral** | `#FAFBFC` | Backgrounds |
| **20% Brand** | `#6C5CE7` | Headers, accents |
| **10% Accent** | `#FF6B6B` | CTAs, highlights |

**Typography**: Inter (body) + Poppins (headings)

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, Vite, React Router |
| **Styling** | CSS3 (Custom Design System) |
| **Backend** | Supabase (PostgreSQL + Auth) |
| **Payments** | Razorpay |
| **Hosting** | Vercel |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account
- Razorpay account (for payments)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/clothshare-app.git
cd clothshare-app

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start development server
npm run dev
```

### Environment Variables

Create a `.env` file with:

```env
# Supabase
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Razorpay (Frontend)
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

For Vercel deployment, also add:
```env
# Razorpay (Backend - Vercel Environment)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

---

## 📁 Project Structure

```
clothshare-app/
├── api/                    # Vercel Serverless Functions
│   ├── create-order.js     # Razorpay order creation
│   └── verify-payment.js   # Payment verification
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── ItemCard.jsx
│   │   └── ...
│   ├── pages/              # Page components
│   │   ├── Home.jsx
│   │   ├── Browse.jsx
│   │   ├── ItemDetail.jsx
│   │   ├── Dashboard.jsx
│   │   └── ...
│   ├── context/            # React Context providers
│   ├── lib/                # Utilities (Supabase, Razorpay)
│   └── data/               # Mock data
├── supabase-schema.sql     # Database schema
└── vercel.json             # Vercel configuration
```

---

## 🗄️ Database Schema

### Tables
- **profiles** - User profiles with avatar, location, rating
- **items** - Listed clothing items with images, pricing
- **rentals** - Rental transactions with status tracking
- **reviews** - User reviews and ratings
- **saved_items** - User's saved/favorited items

Run `supabase-schema.sql` in your Supabase SQL Editor to set up the database.

---

## 📱 Pages

| Page | Description |
|------|-------------|
| **Home** | Landing page with hero, categories, how it works |
| **Browse** | Search and filter items with sidebar filters |
| **Item Detail** | Product page with booking, reviews |
| **Dashboard** | User's listings, rentals, requests |
| **List Item** | Form to list new items with image upload |
| **Auth** | Login/Signup with email magic links |

---

## 🔐 Authentication

- **Magic Link** (OTP-less email login)
- **Email/Password** registration
- Row Level Security (RLS) on all tables

---

## 💳 Payments

Integrated with **Razorpay** for secure payments:
1. User selects rental dates
2. Frontend creates order via `/api/create-order`
3. Razorpay popup for payment
4. Payment verified via `/api/verify-payment`
5. Rental confirmed in database

---

## 📦 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Add environment variables in Vercel Dashboard → Settings → Environment Variables.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Nikhil** - [GitHub](https://github.com/yourusername)

---

<p align="center">
  Made with ❤️ for college students
</p>
