# MediView Backend - Visual Guide

## 🎨 Project Structure

```
mediview/
│
├── 📁 backend/                          ← NEW! Complete Backend API
│   │
│   ├── 📄 server.js                     ← Main Express server
│   ├── 📄 package.json                  ← Dependencies
│   ├── 📄 .env.example                  ← Config template
│   ├── 📄 .gitignore                    ← Git ignore
│   ├── 📄 README.md                     ← Backend docs
│   ├── 📄 test-api.http                 ← API tests
│   │
│   ├── 📁 routes/                       ← API Routes
│   │   ├── 📄 medicines.js              ← Medicine endpoints
│   │   ├── 📄 auth.js                   ← Authentication
│   │   └── 📄 users.js                  ← User management
│   │
│   ├── 📁 middleware/                   ← Middleware
│   │   └── 📄 auth.js                   ← JWT auth
│   │
│   └── 📁 data/                         ← Database
│       └── 📄 medicines.js              ← Medicine data
│
├── 📁 mediview/                         ← Frontend
│   └── 📁 main page 2.0/
│       ├── 📄 index.html                ← Main page
│       ├── 📄 medicine-details.html     ← Details page
│       └── 📁 js/
│           └── 📄 api-integration.js    ← NEW! API Client
│
├── 📄 README.md                         ← Main documentation
├── 📄 BACKEND_SETUP.md                  ← Setup guide
├── 📄 ARCHITECTURE.md                   ← Architecture
├── 📄 GETTING_STARTED.md                ← Quick start
├── 📄 SUMMARY.md                        ← Summary
├── 📄 install-backend.bat               ← Install script
└── 📄 start-backend.bat                 ← Start script
```

## 🔄 Data Flow Diagram

```
┌─────────────┐
│   Browser   │
│  (Frontend) │
└──────┬──────┘
       │
       │ User types "para"
       ↓
┌──────────────────────────────────┐
│  api-integration.js              │
│  • Debounce 300ms                │
│  • Build request                 │
└──────┬───────────────────────────┘
       │
       │ GET /api/medicines/suggest/autocomplete?q=para
       ↓
┌──────────────────────────────────┐
│  Backend Server (Port 5000)      │
│  • CORS check                    │
│  • Rate limit check              │
│  • Security headers              │
└──────┬───────────────────────────┘
       │
       ↓
┌──────────────────────────────────┐
│  medicines.js Route              │
│  • Parse query                   │
│  • Search algorithm              │
│  • Score results                 │
│  • Sort by relevance             │
└──────┬───────────────────────────┘
       │
       ↓
┌──────────────────────────────────┐
│  medicines.js Data               │
│  • Filter medicines              │
│  • Calculate scores              │
│  • Return top 5                  │
└──────┬───────────────────────────┘
       │
       │ JSON Response
       ↓
┌──────────────────────────────────┐
│  Frontend                        │
│  • Parse JSON                    │
│  • Display suggestions           │
│  • Highlight matches             │
└──────────────────────────────────┘
```

## 🔍 Search Algorithm Visualization

```
User Query: "para"
     ↓
┌────────────────────────────────────────┐
│  For each medicine in database:        │
│                                         │
│  Medicine: "Paracetamol"               │
│  ├─ Name starts with "para"? ✓ +50    │
│  ├─ Brand "Tylenol" contains? ✗ +0    │
│  ├─ Generic "Acetaminophen"? ✗ +0     │
│  └─ Total Score: 50                    │
│                                         │
│  Medicine: "Omeprazole"                │
│  ├─ Name starts with "para"? ✗ +0     │
│  ├─ Brand "Prilosec" contains? ✗ +0   │
│  └─ Total Score: 0                     │
└────────────────────────────────────────┘
     ↓
Sort by score (highest first)
     ↓
Return top 5 results
```

## 🔐 Authentication Flow

```
┌─────────────────────────────────────────────────────┐
│                  REGISTRATION                        │
└─────────────────────────────────────────────────────┘

User fills form
     ↓
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
     ↓
┌─────────────────────────────────────┐
│  Backend Validation                 │
│  ✓ Email format                     │
│  ✓ Password length (min 6)          │
│  ✓ Name not empty                   │
│  ✓ User doesn't exist               │
└─────────────────────────────────────┘
     ↓
┌─────────────────────────────────────┐
│  Hash Password                      │
│  bcrypt.hash(password, 10)          │
│  → $2a$10$abc...xyz                 │
└─────────────────────────────────────┘
     ↓
┌─────────────────────────────────────┐
│  Store User                         │
│  users.push({                       │
│    id, email, hashedPassword, name  │
│  })                                 │
└─────────────────────────────────────┘
     ↓
┌─────────────────────────────────────┐
│  Generate JWT Token                 │
│  jwt.sign({ userId }, secret)       │
│  → eyJhbGc...xyz                    │
└─────────────────────────────────────┘
     ↓
Return { token, user }
     ↓
Frontend stores token in localStorage
```

## 📊 Medicine Data Structure

```
┌─────────────────────────────────────────────────────┐
│                    MEDICINE                          │
├─────────────────────────────────────────────────────┤
│  Basic Info                                          │
│  ├─ id: "paracetamol-500"                          │
│  ├─ name: "Paracetamol"                            │
│  ├─ brandNames: ["Tylenol", "Calpol"]             │
│  ├─ genericName: "Acetaminophen"                   │
│  ├─ strength: "500mg"                              │
│  ├─ type: "Pain Relief"                            │
│  ├─ category: "Analgesic/Antipyretic"             │
│  └─ manufacturer: "Various"                         │
├─────────────────────────────────────────────────────┤
│  Pricing & Availability                             │
│  ├─ price: 25.00                                   │
│  ├─ availability: "In Stock"                       │
│  └─ prescriptionRequired: false                    │
├─────────────────────────────────────────────────────┤
│  Medical Information                                 │
│  ├─ description: "..."                             │
│  ├─ uses: ["Pain relief", "Fever"]                │
│  ├─ dosage: { adult, child, form }                │
│  ├─ sideEffects: ["Nausea", ...]                  │
│  ├─ precautions: ["Do not exceed", ...]           │
│  └─ interactions: ["Warfarin", ...]               │
├─────────────────────────────────────────────────────┤
│  Safety Information                                  │
│  ├─ pregnancy: "Generally safe"                    │
│  ├─ breastfeeding: "Safe to use"                  │
│  └─ storage: "Room temperature"                    │
├─────────────────────────────────────────────────────┤
│  Scientific Data                                     │
│  └─ chemicalFormula: "C8H9NO2"                     │
└─────────────────────────────────────────────────────┘
```

## 🛡️ Security Layers

```
┌─────────────────────────────────────────────────────┐
│  Layer 1: Rate Limiting                              │
│  • 100 requests per 15 minutes                       │
│  • Per IP address                                    │
│  • Returns 429 if exceeded                           │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│  Layer 2: Helmet.js                                  │
│  • X-Content-Type-Options                            │
│  • X-Frame-Options                                   │
│  • X-XSS-Protection                                  │
│  • Strict-Transport-Security                         │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│  Layer 3: CORS                                       │
│  • Allow specific origins                            │
│  • Control methods (GET, POST, etc.)                 │
│  • Handle preflight requests                         │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│  Layer 4: Input Validation                           │
│  • express-validator                                 │
│  • Email format check                                │
│  • Password strength                                 │
│  • Sanitize inputs                                   │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│  Layer 5: JWT Authentication                         │
│  • Token verification                                │
│  • Expiration check                                  │
│  • Protected routes                                  │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│  Layer 6: Password Hashing                           │
│  • bcrypt with 10 rounds                             │
│  • Salt generation                                   │
│  • Secure comparison                                 │
└─────────────────────────────────────────────────────┘
```

## 🚀 Deployment Flow (Future)

```
┌─────────────────────────────────────────────────────┐
│  Development                                         │
│  • Local machine                                     │
│  • npm run dev                                       │
│  • Port 5000                                         │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│  Testing                                             │
│  • Run tests                                         │
│  • Check coverage                                    │
│  • Verify endpoints                                  │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│  Build                                               │
│  • npm install --production                          │
│  • Set environment variables                         │
│  • Optimize code                                     │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│  Deploy                                              │
│  • Heroku / AWS / DigitalOcean                      │
│  • Set up MongoDB                                    │
│  • Configure domain                                  │
│  • Enable SSL                                        │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│  Monitor                                             │
│  • Check logs                                        │
│  • Monitor performance                               │
│  • Track errors                                      │
└─────────────────────────────────────────────────────┘
```

## 📈 Performance Optimization

```
┌─────────────────────────────────────────────────────┐
│  Frontend Optimization                               │
│  ├─ Debouncing (300ms)                              │
│  ├─ Caching responses                                │
│  ├─ Lazy loading                                     │
│  └─ Minification                                     │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│  Backend Optimization                                │
│  ├─ Efficient algorithms                             │
│  ├─ In-memory data                                   │
│  ├─ Response compression                             │
│  └─ Connection pooling                               │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│  Database Optimization (Future)                      │
│  ├─ Indexing                                         │
│  ├─ Query optimization                               │
│  ├─ Caching (Redis)                                  │
│  └─ Pagination                                       │
└─────────────────────────────────────────────────────┘
```

## 🎯 API Response Format

```
┌─────────────────────────────────────────────────────┐
│  Success Response                                    │
├─────────────────────────────────────────────────────┤
│  Status: 200 OK                                      │
│  Content-Type: application/json                      │
│                                                       │
│  Body:                                               │
│  [                                                   │
│    {                                                 │
│      "id": "paracetamol-500",                       │
│      "name": "Paracetamol",                         │
│      "brandNames": ["Tylenol"],                     │
│      "type": "Pain Relief",                         │
│      "strength": "500mg",                           │
│      "price": 25.00,                                │
│      ...                                            │
│    }                                                 │
│  ]                                                   │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  Error Response                                      │
├─────────────────────────────────────────────────────┤
│  Status: 400/401/404/500                            │
│  Content-Type: application/json                      │
│                                                       │
│  Body:                                               │
│  {                                                   │
│    "error": {                                        │
│      "message": "Medicine not found",               │
│      "status": 404                                  │
│    }                                                 │
│  }                                                   │
└─────────────────────────────────────────────────────┘
```

## 🎨 Color-Coded Status

```
🟢 Ready to Use
   ├─ Backend server
   ├─ API endpoints
   ├─ Medicine database
   ├─ Authentication
   └─ Documentation

🟡 Needs Configuration
   ├─ Add API script to HTML (1 line)
   └─ Create .env file (optional)

🔴 Future Enhancements
   ├─ MongoDB integration
   ├─ Reviews & ratings
   ├─ Prescription management
   └─ Mobile app
```

## 📱 Quick Commands Reference

```
┌─────────────────────────────────────────────────────┐
│  Installation                                        │
│  $ install-backend.bat                              │
│  or                                                  │
│  $ cd backend && npm install                        │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  Start Server                                        │
│  $ start-backend.bat                                │
│  or                                                  │
│  $ cd backend && npm run dev                        │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  Test API                                            │
│  $ curl http://localhost:5000/api/health            │
│  $ curl http://localhost:5000/api/medicines         │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  Stop Server                                         │
│  Press Ctrl + C in terminal                         │
└─────────────────────────────────────────────────────┘
```

---

**Visual Guide Complete!** 🎨

For detailed instructions, see:
- [GETTING_STARTED.md](GETTING_STARTED.md) - Step-by-step guide
- [ARCHITECTURE.md](ARCHITECTURE.md) - Technical architecture
- [README.md](README.md) - Main documentation
