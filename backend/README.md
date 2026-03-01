# MediView Backend API

Node.js backend for the MediView healthcare platform.

## Features

- 🔍 Advanced medicine search with fuzzy matching
- 💊 Comprehensive medicine database
- 🔐 User authentication (JWT)
- 🚀 RESTful API design
- 🛡️ Security with Helmet and rate limiting
- 📊 Medicine alternatives and similar suggestions

## Installation

```bash
cd backend
npm install
```

## Configuration

1. Copy `.env.example` to `.env`:
```bash
copy .env.example .env
```

2. Update the `.env` file with your configuration

## Running the Server

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### Medicines

- `GET /api/medicines` - Get all medicines (with optional filters)
- `GET /api/medicines/search?q=query` - Search medicines
- `GET /api/medicines/suggest/autocomplete?q=query` - Get autocomplete suggestions
- `GET /api/medicines/:id` - Get medicine details
- `GET /api/medicines/:id/similar` - Get similar medicines
- `GET /api/medicines/:id/alternatives` - Get alternative medicines

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Users

- `GET /api/users/profile` - Get user profile (protected)
- `PUT /api/users/profile` - Update user profile (protected)

### Health Check

- `GET /api/health` - Check API status

## Example Requests

### Search Medicines
```bash
curl "http://localhost:5000/api/medicines/search?q=paracetamol"
```

### Get Autocomplete Suggestions
```bash
curl "http://localhost:5000/api/medicines/suggest/autocomplete?q=para"
```

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123","name":"John Doe"}'
```

## Frontend Integration

Update your frontend JavaScript to use the API:

```javascript
// Search medicines
async function searchMedicines(query) {
  const response = await fetch(`http://localhost:5000/api/medicines/search?q=${query}`);
  return await response.json();
}

// Get autocomplete suggestions
async function getAutocompleteSuggestions(query) {
  const response = await fetch(`http://localhost:5000/api/medicines/suggest/autocomplete?q=${query}`);
  return await response.json();
}
```

## Next Steps

1. Install dependencies: `npm install`
2. Create `.env` file from `.env.example`
3. Run the server: `npm run dev`
4. Test the API endpoints
5. Integrate with your frontend

## Future Enhancements

- MongoDB database integration
- Medicine reviews and ratings
- Prescription management
- Doctor appointments
- Health records
- Image upload for medicine recognition
- Real-time notifications
