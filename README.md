# DrugDex - Healthcare Platform

<div align="center">

![DrugDex](mediview/logo/logo.svg)

**A comprehensive healthcare platform with medicine search, doctor consultation, and health management features.**

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.18-blue.svg)](https://expressjs.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

[Features](#features) • [Quick Start](#quick-start) • [Documentation](#documentation) • [API](#api-endpoints) • [Contributing](#contributing)

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Documentation](#documentation)
- [API Endpoints](#api-endpoints)
- [Technologies](#technologies)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

DrugDex is a modern healthcare platform that provides:
- **Advanced Medicine Search** with fuzzy matching and autocomplete
- **Comprehensive Medicine Database** with detailed information
- **User Authentication** with JWT security
- **Doctor Consultation** features
- **Health Management** tools
- **RESTful API** for integration

## ✨ Features

### Backend
- 🔍 **Advanced Search** - Fuzzy matching algorithm with relevance scoring
- 💡 **Smart Autocomplete** - Real-time suggestions with debouncing
- 💊 **Medicine Database** - 7+ medicines with 20+ fields each
- 🔐 **Authentication** - JWT-based secure authentication
- 🔄 **Similar Medicines** - Find alternatives and generic options
- 💰 **Price Comparison** - Compare medicine prices
- 🛡️ **Security** - Rate limiting, CORS, input validation, Helmet.js
- 📊 **RESTful API** - 11 well-documented endpoints

### Frontend
- 🎨 **Modern UI** - Clean, responsive design
- 🔍 **Real-time Search** - Instant medicine search
- 💡 **Autocomplete** - Smart suggestions as you type
- 📱 **Responsive** - Works on all devices
- 🎓 **Student Mode** - Chemical structures and learning tools
- 🤖 **AI Assistant** - Health guidance chatbot
- 📊 **Health Dashboard** - Track your health metrics

## 📁 Project Structure

```
mediview/
├── backend/                    # Node.js Backend
│   ├── server.js              # Express server
│   ├── routes/                # API routes
│   │   ├── medicines.js       # Medicine endpoints
│   │   ├── auth.js           # Authentication
│   │   └── users.js          # User management
│   ├── middleware/            # Custom middleware
│   │   └── auth.js           # JWT authentication
│   ├── data/                  # Database
│   │   └── medicines.js      # Medicine data
│   ├── package.json          # Dependencies
│   └── README.md             # Backend docs
│
├── mediview/                  # Frontend
│   ├── main page 2.0/        # Main website
│   │   ├── index.html        # Homepage
│   │   ├── test-backend.html # API test page
│   │   ├── js/               # JavaScript files
│   │   │   ├── api-integration.js  # API client
│   │   │   ├── script.js     # Main scripts
│   │   │   └── ...
│   │   └── css/              # Stylesheets
│   ├── login page/           # Authentication UI
│   └── logo/                 # Brand assets
│
├── docs/                      # Documentation
│   ├── README.md             # Documentation index
│   ├── QUICK_START.md        # Quick start guide
│   ├── INSTALLATION.md       # Installation guide
│   ├── BACKEND_SETUP.md      # Backend setup
│   ├── API_DOCUMENTATION.md  # API reference
│   ├── ARCHITECTURE.md       # Architecture overview
│   └── ...
│
├── scripts/                   # Helper scripts
│   ├── install-backend.bat   # Install dependencies
│   ├── start-backend.bat     # Start server
│   └── README.md             # Scripts documentation
│
├── .gitignore                # Git ignore rules
├── README.md                 # This file
└── LICENSE                   # MIT License
```

## 🚀 Quick Start

### Prerequisites

- Node.js 14+ and npm
- Modern web browser
- (Optional) MongoDB for database

### Installation

**Option 1: Using Scripts (Recommended)**

```bash
# 1. Install backend dependencies
scripts\install-backend.bat

# 2. Start the backend server
scripts\start-backend.bat

# 3. Open frontend
# Navigate to mediview/main page 2.0/
# Open index.html in your browser
```

**Option 2: Manual Installation**

```bash
# 1. Install dependencies
cd backend
npm install

# 2. Configure environment
copy .env.example .env

# 3. Start server
npm start

# 4. Open frontend
# Open mediview/main page 2.0/index.html in browser
```

### Verify Installation

1. **Backend Health Check:**
   ```
   http://localhost:5000/api/health
   ```
   Should return: `{"status":"OK","message":"DrugDex API is running"}`

2. **Test Page:**
   ```
   mediview/main page 2.0/test-backend.html
   ```
   Open in browser to test all features

3. **Main Website:**
   ```
   mediview/main page 2.0/index.html
   ```
   Your fully functional healthcare platform!

## 📚 Documentation

Comprehensive documentation is available in the `docs/` folder:

- **[Quick Start Guide](docs/QUICK_START.md)** - Get started in 3 steps
- **[Installation Guide](docs/INSTALLATION.md)** - Detailed setup instructions
- **[Backend Setup](docs/BACKEND_SETUP.md)** - Backend configuration
- **[API Documentation](docs/API_DOCUMENTATION.md)** - Complete API reference
- **[Architecture](docs/ARCHITECTURE.md)** - System design and architecture
- **[Frontend Integration](docs/FRONTEND_INTEGRATION.md)** - Connect frontend to backend
- **[Testing Guide](docs/TESTING_GUIDE.md)** - How to test the application
- **[Project Summary](docs/PROJECT_SUMMARY.md)** - Complete overview

## 🔌 API Endpoints

### Medicines

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/medicines` | Get all medicines |
| GET | `/api/medicines/search?q=query` | Search medicines |
| GET | `/api/medicines/suggest/autocomplete?q=query` | Autocomplete suggestions |
| GET | `/api/medicines/:id` | Get medicine details |
| GET | `/api/medicines/:id/similar` | Get similar medicines |
| GET | `/api/medicines/:id/alternatives` | Get alternative medicines |

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |

### Users (Protected)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/profile` | Get user profile |
| PUT | `/api/users/profile` | Update user profile |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Check API status |

**Example Request:**
```bash
curl "http://localhost:5000/api/medicines/search?q=paracetamol"
```

**Example Response:**
```json
[
  {
    "id": "paracetamol-500",
    "name": "Paracetamol",
    "brandNames": ["Tylenol", "Calpol"],
    "type": "Pain Relief",
    "strength": "500mg",
    "price": 25.00,
    ...
  }
]
```

See [API Documentation](docs/API_DOCUMENTATION.md) for complete details.

## 🛠️ Technologies

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **express-rate-limit** - Rate limiting
- **express-validator** - Input validation

### Frontend
- **HTML5** - Structure
- **CSS3** - Styling
- **JavaScript** - Logic
- **Fetch API** - HTTP requests
- **Font Awesome** - Icons
- **Google Fonts** - Typography

## 📊 Features Overview

### Medicine Database
- 7+ medicines with complete information
- 20+ fields per medicine including:
  - Brand and generic names
  - Dosage information
  - Side effects
  - Precautions
  - Drug interactions
  - Pregnancy/breastfeeding info
  - Chemical formula
  - Price and availability

### Search Algorithm
- Fuzzy matching for typo tolerance
- Score-based relevance ranking
- Search by name, brand, category, uses
- Real-time autocomplete suggestions

### Security Features
- JWT token authentication
- Password hashing with bcrypt
- Rate limiting (100 req/15min)
- CORS protection
- Input validation
- Security headers (Helmet.js)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Font Awesome for icons
- Google Fonts for typography
- Express.js community
- All contributors

## 📞 Support

For issues, questions, or suggestions:
- Check the [Documentation](docs/)
- Review [Troubleshooting Guide](docs/TROUBLESHOOTING.md)
- Open an issue on GitHub

## 🎯 Roadmap

### Current Version (v2.0)
- ✅ Backend API
- ✅ Medicine search
- ✅ User authentication
- ✅ Frontend integration

### Future Enhancements
- [ ] MongoDB integration
- [ ] Medicine reviews and ratings
- [ ] Prescription management
- [ ] Doctor appointment system
- [ ] Health records
- [ ] Medicine image recognition
- [ ] Real-time notifications
- [ ] Payment integration
- [ ] Admin dashboard
- [ ] Mobile app

---

<div align="center">

**Made with ❤️ for better healthcare**

[⬆ Back to Top](#drugdex---healthcare-platform)

</div>
#   D r u g D e x  
 