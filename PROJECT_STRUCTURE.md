# MediView - Project Structure

## 📁 Complete Directory Structure

```
mediview/
│
├── 📁 backend/                          # Backend API (Node.js/Express)
│   ├── 📄 server.js                     # Main Express server
│   ├── 📄 package.json                  # Dependencies & scripts
│   ├── 📄 .env.example                  # Environment variables template
│   ├── 📄 .gitignore                    # Git ignore rules
│   ├── 📄 README.md                     # Backend documentation
│   ├── 📄 test-api.http                 # API testing examples
│   │
│   ├── 📁 routes/                       # API Route Handlers
│   │   ├── 📄 medicines.js              # Medicine endpoints
│   │   ├── 📄 auth.js                   # Authentication endpoints
│   │   └── 📄 users.js                  # User management endpoints
│   │
│   ├── 📁 middleware/                   # Custom Middleware
│   │   └── 📄 auth.js                   # JWT authentication middleware
│   │
│   ├── 📁 data/                         # Data Layer
│   │   └── 📄 medicines.js              # Medicine database (in-memory)
│   │
│   └── 📁 node_modules/                 # Dependencies (140 packages)
│
├── 📁 mediview/                         # Frontend Application
│   │
│   ├── 📁 main page 2.0/                # Main Website
│   │   ├── 📄 index.html                # Homepage
│   │   ├── 📄 medicine-details.html     # Medicine details page
│   │   ├── 📄 test-backend.html         # Backend testing page
│   │   ├── 📄 styles.new.css            # Main stylesheet
│   │   ├── 📄 script.js                 # Main JavaScript
│   │   ├── 📄 animation.js              # Animations
│   │   │
│   │   ├── 📁 js/                       # JavaScript Modules
│   │   │   ├── 📄 api-integration.js    # Backend API client
│   │   │   ├── 📄 medicines.js          # Medicine logic
│   │   │   ├── 📄 search.js             # Search functionality
│   │   │   ├── 📄 search-handler.js     # Search handlers
│   │   │   ├── 📄 advanced-features.js  # Advanced features
│   │   │   ├── 📄 ai-search.js          # AI search
│   │   │   └── 📄 health-analytics.js   # Health analytics
│   │   │
│   │   ├── 📁 css/                      # Stylesheets
│   │   │   ├── 📄 medicine-details.css  # Medicine details styles
│   │   │   ├── 📄 search-styles.css     # Search styles
│   │   │   └── 📄 medicines.css         # Medicine list styles
│   │   │
│   │   └── 📁 images/                   # Images and assets
│   │
│   ├── 📁 login page/                   # Authentication Pages
│   │   ├── 📄 SignUp_LogIn_Form.html    # Login/Signup form
│   │   ├── 📄 SignUp_LogIn_Form.css     # Form styles
│   │   ├── 📄 SignUp_LogIn_Form.js      # Form logic
│   │   └── 📄 images.jpeg               # Background image
│   │
│   └── 📁 logo/                         # Brand Assets
│       ├── 📄 logo.svg                  # Main logo
│       └── 📄 favicon.svg               # Favicon
│
├── 📁 docs/                             # Documentation
│   ├── 📄 README.md                     # Documentation index
│   ├── 📄 QUICK_START.md                # Quick start guide
│   ├── 📄 INSTALLATION.md               # Installation instructions
│   ├── 📄 BACKEND_SETUP.md              # Backend setup guide
│   ├── 📄 BACKEND_OVERVIEW.md           # Backend overview
│   ├── 📄 ARCHITECTURE.md               # System architecture
│   ├── 📄 FRONTEND_INTEGRATION.md       # Frontend integration
│   ├── 📄 PROJECT_SUMMARY.md            # Project summary
│   ├── 📄 PROJECT_STATUS.md             # Current status
│   ├── 📄 VISUAL_GUIDE.md               # Visual diagrams
│   ├── 📄 TESTING_GUIDE.md              # Testing guide
│   └── 📄 SUCCESS_GUIDE.md              # Success checklist
│
├── 📁 scripts/                          # Helper Scripts
│   ├── 📄 install-backend.bat           # Install dependencies
│   ├── 📄 start-backend.bat             # Start backend server
│   ├── 📄 start-backend-simple.bat      # Alternative start script
│   └── 📄 README.md                     # Scripts documentation
│
├── 📁 .git/                             # Git repository
├── 📁 .vscode/                          # VS Code settings
├── 📁 .venv/                            # Python virtual environment
│
├── 📄 README.md                         # Main project README
├── 📄 PROJECT_STRUCTURE.md              # This file
├── 📄 .gitignore                        # Git ignore rules
├── 📄 LICENSE                           # MIT License
└── 📄 package-lock.json                 # Lock file

```

## 📊 File Count Summary

| Category | Count | Description |
|----------|-------|-------------|
| Backend Files | 12 | Server, routes, middleware, data |
| Frontend Files | 15+ | HTML, CSS, JavaScript |
| Documentation | 12 | Guides, references, tutorials |
| Scripts | 3 | Helper batch files |
| **Total** | **42+** | Plus 140 npm packages |

## 🎯 Key Directories

### `/backend` - Backend API
The Node.js/Express backend server with RESTful API.

**Key Files:**
- `server.js` - Main Express application
- `routes/` - API endpoint handlers
- `middleware/` - Custom middleware (auth)
- `data/` - Medicine database

### `/mediview/main page 2.0` - Main Website
The primary frontend application.

**Key Files:**
- `index.html` - Homepage
- `test-backend.html` - API testing interface
- `js/api-integration.js` - Backend connection
- `styles.new.css` - Main stylesheet

### `/docs` - Documentation
Comprehensive project documentation.

**Key Files:**
- `QUICK_START.md` - Get started quickly
- `INSTALLATION.md` - Setup instructions
- `ARCHITECTURE.md` - System design
- `API_DOCUMENTATION.md` - API reference

### `/scripts` - Helper Scripts
Batch files for easy setup and management.

**Key Files:**
- `install-backend.bat` - One-click installation
- `start-backend.bat` - One-click server start

## 🔗 File Relationships

```
index.html
    ↓ includes
    ├── styles.new.css
    ├── script.js
    ├── animation.js
    └── js/api-integration.js
            ↓ connects to
            backend/server.js
                ↓ uses
                ├── routes/medicines.js
                ├── routes/auth.js
                ├── routes/users.js
                └── data/medicines.js
```

## 📝 File Purposes

### Backend Files

| File | Purpose | Lines |
|------|---------|-------|
| `server.js` | Express server setup, middleware, routes | ~50 |
| `routes/medicines.js` | Medicine API endpoints | ~200 |
| `routes/auth.js` | Authentication endpoints | ~100 |
| `routes/users.js` | User management endpoints | ~50 |
| `middleware/auth.js` | JWT authentication | ~30 |
| `data/medicines.js` | Medicine database | ~400 |

### Frontend Files

| File | Purpose | Lines |
|------|---------|-------|
| `index.html` | Main homepage | ~1200 |
| `test-backend.html` | API testing page | ~400 |
| `api-integration.js` | Backend API client | ~300 |
| `script.js` | Main JavaScript logic | ~800 |
| `styles.new.css` | Main stylesheet | ~1000+ |

### Documentation Files

| File | Purpose | Pages |
|------|---------|-------|
| `README.md` | Main project overview | 1 |
| `QUICK_START.md` | Quick start guide | 1 |
| `INSTALLATION.md` | Installation guide | 2 |
| `BACKEND_SETUP.md` | Backend setup | 2 |
| `ARCHITECTURE.md` | Architecture docs | 3 |

## 🎨 Code Organization

### Backend Structure
```
backend/
├── Entry Point (server.js)
├── Routes (API endpoints)
├── Middleware (authentication, validation)
└── Data (database/models)
```

### Frontend Structure
```
mediview/main page 2.0/
├── Pages (HTML files)
├── Styles (CSS files)
├── Scripts (JavaScript files)
└── Assets (images, fonts)
```

## 📦 Dependencies

### Backend (package.json)
- express (web framework)
- cors (CORS middleware)
- helmet (security headers)
- jsonwebtoken (JWT auth)
- bcryptjs (password hashing)
- express-validator (input validation)
- express-rate-limit (rate limiting)
- dotenv (environment variables)

### Frontend
- Font Awesome (icons)
- Google Fonts (typography)
- Native JavaScript (no frameworks)

## 🔄 Data Flow

```
User Input (Frontend)
    ↓
API Client (api-integration.js)
    ↓
HTTP Request
    ↓
Backend Server (server.js)
    ↓
Route Handler (routes/*.js)
    ↓
Data Layer (data/medicines.js)
    ↓
Response (JSON)
    ↓
Frontend Display
```

## 🎯 Entry Points

### For Users
1. **Main Website**: `mediview/main page 2.0/index.html`
2. **Test Page**: `mediview/main page 2.0/test-backend.html`
3. **Login**: `mediview/login page/SignUp_LogIn_Form.html`

### For Developers
1. **Backend**: `backend/server.js`
2. **API Client**: `mediview/main page 2.0/js/api-integration.js`
3. **Documentation**: `docs/README.md`

### For Setup
1. **Installation**: `scripts/install-backend.bat`
2. **Start Server**: `scripts/start-backend.bat`
3. **Quick Start**: `docs/QUICK_START.md`

## 📊 Size Breakdown

| Category | Size | Files |
|----------|------|-------|
| Backend Code | ~1 MB | 12 |
| Frontend Code | ~2 MB | 15+ |
| Documentation | ~500 KB | 12 |
| Dependencies | ~50 MB | 140 packages |
| **Total** | **~53 MB** | **179+** |

## 🎓 Learning Path

### For New Developers
1. Start with `README.md`
2. Read `docs/QUICK_START.md`
3. Review `docs/ARCHITECTURE.md`
4. Explore `backend/server.js`
5. Check `mediview/main page 2.0/js/api-integration.js`

### For Contributors
1. Read `README.md`
2. Review `docs/ARCHITECTURE.md`
3. Check `backend/routes/` for API structure
4. Explore `mediview/main page 2.0/js/` for frontend logic
5. See `docs/` for detailed documentation

---

**Last Updated**: 2024
**Version**: 2.0
**Total Files**: 179+
**Total Lines of Code**: 2,500+
