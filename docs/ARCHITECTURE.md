# MediView Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (Browser)                    │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  index.html                                            │ │
│  │  ├── Search Interface                                  │ │
│  │  ├── Medicine Details                                  │ │
│  │  ├── User Authentication UI                            │ │
│  │  └── Health Dashboard                                  │ │
│  └────────────────────────────────────────────────────────┘ │
│                           ↕                                  │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  api-integration.js (API Client)                       │ │
│  │  ├── Search Functions                                  │ │
│  │  ├── Autocomplete                                      │ │
│  │  ├── Authentication                                    │ │
│  │  └── Medicine Details                                  │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                           ↕ HTTP/HTTPS
┌─────────────────────────────────────────────────────────────┐
│                    Backend (Node.js/Express)                 │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  server.js (Main Server)                               │ │
│  │  ├── Middleware (CORS, Helmet, Rate Limiting)         │ │
│  │  ├── Routes                                            │ │
│  │  └── Error Handling                                    │ │
│  └────────────────────────────────────────────────────────┘ │
│                           ↕                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Medicines  │  │     Auth     │  │    Users     │     │
│  │   Routes     │  │   Routes     │  │   Routes     │     │
│  │              │  │              │  │              │     │
│  │ • Search     │  │ • Register   │  │ • Profile    │     │
│  │ • Details    │  │ • Login      │  │ • Update     │     │
│  │ • Similar    │  │ • JWT        │  │              │     │
│  │ • Alternatives│  │              │  │              │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                           ↕                                  │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Data Layer                                            │ │
│  │  ├── medicines.js (In-Memory Database)                │ │
│  │  └── users[] (In-Memory Storage)                      │ │
│  │                                                         │ │
│  │  Future: MongoDB Integration                           │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Request Flow

### Medicine Search Flow

```
User Types "para" in Search Box
         ↓
Frontend: api-integration.js
         ↓ (Debounced 300ms)
GET /api/medicines/suggest/autocomplete?q=para
         ↓
Backend: medicines.js route
         ↓
Search Algorithm (Fuzzy Match + Scoring)
         ↓
Filter & Sort Results
         ↓
Return JSON Response
         ↓
Frontend: Display Suggestions
         ↓
User Clicks Suggestion
         ↓
Navigate to Medicine Details Page
```

### Authentication Flow

```
User Fills Registration Form
         ↓
POST /api/auth/register
         ↓
Backend: Validate Input
         ↓
Hash Password (bcrypt)
         ↓
Store User (In-Memory)
         ↓
Generate JWT Token
         ↓
Return Token + User Data
         ↓
Frontend: Store Token in localStorage
         ↓
Include Token in Future Requests
```

## API Architecture

### Endpoint Structure

```
/api
├── /health                    # Health check
├── /medicines
│   ├── GET /                  # List all
│   ├── GET /search            # Search with query
│   ├── GET /suggest/autocomplete  # Autocomplete
│   ├── GET /:id               # Get by ID
│   ├── GET /:id/similar       # Similar medicines
│   └── GET /:id/alternatives  # Alternatives
├── /auth
│   ├── POST /register         # User registration
│   └── POST /login            # User login
└── /users
    ├── GET /profile           # Get profile (protected)
    └── PUT /profile           # Update profile (protected)
```

## Security Layers

```
┌─────────────────────────────────────────┐
│  Rate Limiting (100 req/15min)          │
├─────────────────────────────────────────┤
│  Helmet.js (Security Headers)           │
├─────────────────────────────────────────┤
│  CORS (Cross-Origin Resource Sharing)   │
├─────────────────────────────────────────┤
│  Input Validation (express-validator)   │
├─────────────────────────────────────────┤
│  JWT Authentication (Protected Routes)  │
├─────────────────────────────────────────┤
│  Password Hashing (bcrypt)              │
└─────────────────────────────────────────┘
```

## Search Algorithm

### Scoring System

```javascript
Score Calculation:
├── Exact name match:        +100 points
├── Name starts with query:  +50 points
├── Name contains query:     +30 points
├── Generic name match:      +90 points
├── Generic contains query:  +25 points
├── Brand exact match:       +80 points
├── Brand starts with:       +40 points
├── Brand contains:          +20 points
├── Category match:          +15 points
└── Uses match:              +10 points

Results sorted by score (highest first)
```

## Data Model

### Medicine Object

```javascript
{
  id: "paracetamol-500",
  name: "Paracetamol",
  brandNames: ["Tylenol", "Calpol"],
  genericName: "Acetaminophen",
  strength: "500mg",
  type: "Pain Relief",
  category: "Analgesic/Antipyretic",
  manufacturer: "Various",
  price: 25.00,
  description: "...",
  uses: ["Pain relief", "Fever reduction"],
  dosage: {
    adult: "500-1000mg every 4-6 hours",
    child: "10-15mg/kg every 4-6 hours",
    form: "Tablet, Syrup"
  },
  sideEffects: ["Nausea", "Stomach pain"],
  precautions: ["Do not exceed dose"],
  interactions: ["Warfarin", "Alcohol"],
  pregnancy: "Generally safe",
  breastfeeding: "Safe to use",
  storage: "Room temperature",
  chemicalFormula: "C8H9NO2",
  availability: "In Stock",
  prescriptionRequired: false
}
```

### User Object

```javascript
{
  id: "unique-id",
  email: "user@example.com",
  password: "hashed-password",
  name: "John Doe",
  createdAt: Date
}
```

## Technology Stack

### Backend
```
Node.js (Runtime)
    ↓
Express.js (Web Framework)
    ↓
Middleware Stack
    ├── helmet (Security)
    ├── cors (CORS)
    ├── express-rate-limit (Rate Limiting)
    └── express-validator (Validation)
    ↓
Authentication
    ├── jsonwebtoken (JWT)
    └── bcryptjs (Password Hashing)
```

### Frontend
```
HTML5 (Structure)
    ↓
CSS3 (Styling)
    ↓
JavaScript (Logic)
    ├── Fetch API (HTTP Requests)
    ├── LocalStorage (Token Storage)
    └── DOM Manipulation
```

## Deployment Architecture (Future)

```
┌─────────────────────────────────────────────────────┐
│                   Load Balancer                      │
└─────────────────────────────────────────────────────┘
                        ↓
        ┌───────────────┴───────────────┐
        ↓                               ↓
┌───────────────┐              ┌───────────────┐
│  Node.js      │              │  Node.js      │
│  Instance 1   │              │  Instance 2   │
└───────────────┘              └───────────────┘
        ↓                               ↓
        └───────────────┬───────────────┘
                        ↓
        ┌───────────────────────────────┐
        │      MongoDB Cluster          │
        │  ┌─────────┐  ┌─────────┐   │
        │  │ Primary │  │ Replica │   │
        │  └─────────┘  └─────────┘   │
        └───────────────────────────────┘
                        ↓
        ┌───────────────────────────────┐
        │      Redis Cache              │
        └───────────────────────────────┘
```

## Performance Optimizations

### Current
- Debounced search (300ms)
- In-memory data storage
- Efficient scoring algorithm
- Rate limiting

### Future
- Redis caching
- Database indexing
- CDN for static assets
- Gzip compression
- Response pagination
- Query optimization

## Scalability Considerations

### Horizontal Scaling
- Stateless API design
- JWT tokens (no session storage)
- Load balancer ready
- Database connection pooling

### Vertical Scaling
- Efficient algorithms
- Minimal memory footprint
- Optimized queries
- Caching strategies

## Monitoring & Logging (Future)

```
Application Logs
    ↓
Winston Logger
    ↓
    ├── Console (Development)
    ├── File (Production)
    └── Cloud Service (AWS CloudWatch, etc.)

Metrics
    ↓
    ├── Request Count
    ├── Response Time
    ├── Error Rate
    └── Active Users
```

---

This architecture provides a solid foundation for a scalable, secure, and maintainable healthcare platform.
