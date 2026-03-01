# MediView Backend Setup Guide

## Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

Create a `.env` file in the backend directory:

```bash
copy backend\.env.example backend\.env
```

Edit the `.env` file if needed (default settings work for local development).

### 3. Start the Backend Server

```bash
cd backend
npm run dev
```

The server will start on `http://localhost:5000`

You should see:
```
🚀 MediView API server running on port 5000
📍 Health check: http://localhost:5000/api/health
```

### 4. Test the API

Open your browser and visit:
- Health Check: http://localhost:5000/api/health
- Search Medicines: http://localhost:5000/api/medicines/search?q=paracetamol
- Autocomplete: http://localhost:5000/api/medicines/suggest/autocomplete?q=para

### 5. Update Frontend

Add the API integration script to your HTML file. Open `mediview/main page 2.0/index.html` and add before the closing `</body>` tag:

```html
<script src="js/api-integration.js"></script>
```

### 6. Test the Integration

1. Start the backend server (if not already running)
2. Open `mediview/main page 2.0/index.html` in your browser
3. Try searching for medicines - it will now use the backend API!

## API Endpoints

### Medicines

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/medicines` | Get all medicines |
| GET | `/api/medicines/search?q=query` | Search medicines |
| GET | `/api/medicines/suggest/autocomplete?q=query` | Autocomplete suggestions |
| GET | `/api/medicines/:id` | Get medicine details |
| GET | `/api/medicines/:id/similar` | Get similar medicines |
| GET | `/api/medicines/:id/alternatives` | Get alternatives |

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |

### Users (Protected)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/profile` | Get user profile |
| PUT | `/api/users/profile` | Update profile |

## Features Implemented

✅ **Advanced Medicine Search**
- Fuzzy matching algorithm
- Score-based relevance ranking
- Search by name, brand, category, and uses

✅ **Smart Autocomplete**
- Real-time suggestions
- Debounced requests (300ms)
- Fallback to local search if API unavailable

✅ **Medicine Details**
- Complete medicine information
- Similar medicines
- Alternative/generic options
- Price comparison

✅ **User Authentication**
- JWT-based authentication
- Secure password hashing
- Protected routes

✅ **Security**
- Helmet.js for security headers
- Rate limiting (100 requests per 15 minutes)
- CORS enabled
- Input validation

## Testing with cURL

### Search Medicines
```bash
curl "http://localhost:5000/api/medicines/search?q=paracetamol"
```

### Get Autocomplete
```bash
curl "http://localhost:5000/api/medicines/suggest/autocomplete?q=para"
```

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"test@example.com\",\"password\":\"password123\",\"name\":\"Test User\"}"
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"test@example.com\",\"password\":\"password123\"}"
```

## Troubleshooting

### Port Already in Use
If port 5000 is already in use, change it in `.env`:
```
PORT=3000
```

### CORS Issues
The backend is configured to allow all origins. For production, update the CORS settings in `server.js`.

### API Not Responding
1. Check if the server is running
2. Check the console for errors
3. Verify the API_BASE_URL in `api-integration.js` matches your server

## Next Steps

1. **Add Database**: Replace in-memory storage with MongoDB
2. **Add More Endpoints**: Reviews, ratings, appointments
3. **File Upload**: Medicine image recognition
4. **Real-time Features**: WebSocket for notifications
5. **Caching**: Add Redis for better performance
6. **Testing**: Add unit and integration tests
7. **Documentation**: Add Swagger/OpenAPI docs

## Production Deployment

For production deployment:

1. Set strong JWT_SECRET in `.env`
2. Use a proper database (MongoDB)
3. Enable HTTPS
4. Set up proper CORS origins
5. Add logging (Winston, Morgan)
6. Set up monitoring
7. Use environment-specific configs
8. Add API documentation

## Support

For issues or questions, check:
- Backend logs in the console
- Browser console for frontend errors
- Network tab in browser DevTools
