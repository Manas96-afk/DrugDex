# Getting Started with MediView

## Prerequisites Checklist

Before you begin, make sure you have:

- [ ] Node.js installed (version 14 or higher)
  - Check: Open terminal and run `node --version`
  - Download from: https://nodejs.org/

- [ ] npm installed (comes with Node.js)
  - Check: Run `npm --version`

- [ ] A modern web browser (Chrome, Firefox, Edge, Safari)

- [ ] A code editor (VS Code, Sublime Text, etc.) - Optional but recommended

## Installation Steps

### Step 1: Install Backend Dependencies

**Option A: Using the batch file (Easiest)**
```bash
# Double-click install-backend.bat
# OR run in terminal:
install-backend.bat
```

**Option B: Manual installation**
```bash
cd backend
npm install
```

Expected output:
```
✓ Dependencies installed successfully
✓ .env file created
```

### Step 2: Start the Backend Server

**Option A: Using the batch file**
```bash
# Double-click start-backend.bat
# OR run in terminal:
start-backend.bat
```

**Option B: Manual start**
```bash
cd backend
npm run dev
```

Expected output:
```
🚀 MediView API server running on port 5000
📍 Health check: http://localhost:5000/api/health
```

### Step 3: Verify Backend is Running

Open your browser and visit:
- http://localhost:5000/api/health

You should see:
```json
{
  "status": "OK",
  "message": "MediView API is running"
}
```

### Step 4: Test the API

Try these URLs in your browser:

1. **Search for medicines:**
   http://localhost:5000/api/medicines/search?q=paracetamol

2. **Get autocomplete suggestions:**
   http://localhost:5000/api/medicines/suggest/autocomplete?q=para

3. **Get all medicines:**
   http://localhost:5000/api/medicines

### Step 5: Open the Frontend

1. Navigate to: `mediview/main page 2.0/`
2. Open `index.html` in your browser
3. Try searching for medicines!

### Step 6: Add API Integration (Important!)

To connect the frontend to the backend, add this line to your `index.html`:

Find the script section (around line 1154) and add:
```html
<script src="js/api-integration.js"></script>
```

The complete script section should look like:
```html
<script src="script.js"></script>
<script src="animation.js"></script>
<script src="js/medicines.js"></script>
<script src="js/search.js"></script>
<script src="js/search-handler.js"></script>
<script src="js/advanced-features.js"></script>
<script src="js/ai-search.js"></script>
<script src="js/health-analytics.js"></script>
<script src="js/api-integration.js"></script> <!-- ADD THIS LINE -->
```

## Testing the Integration

### Test 1: Search Functionality

1. Open the website in your browser
2. Type "para" in the search box
3. You should see autocomplete suggestions
4. Click on a suggestion
5. You should see detailed medicine information

### Test 2: Backend API

Open browser DevTools (F12) → Network tab:
1. Type in the search box
2. You should see API calls to `localhost:5000`
3. Check the responses

### Test 3: Authentication (Optional)

Using cURL or Postman:

**Register a user:**
```bash
curl -X POST http://localhost:5000/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"test@example.com\",\"password\":\"password123\",\"name\":\"Test User\"}"
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"test@example.com\",\"password\":\"password123\"}"
```

## Troubleshooting

### Problem: "npm is not recognized"

**Solution:** Node.js is not installed or not in PATH
1. Download and install Node.js from https://nodejs.org/
2. Restart your terminal
3. Try again

### Problem: "Port 5000 is already in use"

**Solution:** Another application is using port 5000
1. Stop the other application
2. OR change the port in `backend/.env`:
   ```
   PORT=3000
   ```
3. Restart the server

### Problem: "Cannot GET /api/medicines"

**Solution:** Backend server is not running
1. Make sure you started the server
2. Check the terminal for errors
3. Verify the server is running on port 5000

### Problem: "CORS error" in browser console

**Solution:** Backend CORS is not configured properly
1. The backend already has CORS enabled
2. Make sure you're accessing the frontend via a web server (not file://)
3. Check that API_BASE_URL in `api-integration.js` is correct

### Problem: No autocomplete suggestions

**Solution:** API integration not loaded
1. Make sure `api-integration.js` is included in your HTML
2. Check browser console for JavaScript errors
3. Verify the backend is running

### Problem: "Failed to fetch"

**Solution:** Backend is not accessible
1. Check if backend server is running
2. Verify the URL in `api-integration.js` is correct
3. Check firewall settings

## Quick Reference

### Start Backend
```bash
cd backend
npm run dev
```

### Stop Backend
Press `Ctrl + C` in the terminal

### View Backend Logs
Check the terminal where the server is running

### Test API Endpoints
Use browser, cURL, or Postman:
```bash
curl http://localhost:5000/api/health
```

### Clear Browser Cache
If changes aren't showing:
1. Press `Ctrl + Shift + Delete`
2. Clear cache and cookies
3. Refresh the page

## Next Steps

Once everything is working:

1. **Explore the API**
   - Try different search queries
   - Test all endpoints
   - Check the responses

2. **Customize**
   - Add more medicines to `backend/data/medicines.js`
   - Modify the search algorithm
   - Add new features

3. **Integrate Database**
   - Set up MongoDB
   - Replace in-memory storage
   - Add data persistence

4. **Deploy**
   - Choose a hosting provider
   - Set up production environment
   - Configure domain and SSL

## Useful Commands

### Backend
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start
```

### Check if server is running
```bash
curl http://localhost:5000/api/health
```

### View all medicines
```bash
curl http://localhost:5000/api/medicines
```

### Search medicines
```bash
curl "http://localhost:5000/api/medicines/search?q=pain"
```

## File Structure Reference

```
mediview/
├── backend/                    # Backend API
│   ├── server.js              # Main server file
│   ├── package.json           # Dependencies
│   ├── .env                   # Configuration (create this)
│   ├── routes/                # API routes
│   ├── middleware/            # Auth middleware
│   └── data/                  # Medicine database
├── mediview/
│   └── main page 2.0/         # Frontend
│       ├── index.html         # Main page
│       └── js/
│           └── api-integration.js  # API client
├── install-backend.bat        # Installation script
├── start-backend.bat          # Start script
└── README.md                  # Documentation
```

## Support & Documentation

- **Main README:** [README.md](README.md)
- **Backend Setup:** [BACKEND_SETUP.md](BACKEND_SETUP.md)
- **Architecture:** [ARCHITECTURE.md](ARCHITECTURE.md)
- **Frontend Integration:** [mediview/main page 2.0/INTEGRATION_GUIDE.md](mediview/main%20page%202.0/INTEGRATION_GUIDE.md)
- **API Testing:** [backend/test-api.http](backend/test-api.http)

## Success Checklist

- [ ] Node.js and npm installed
- [ ] Backend dependencies installed
- [ ] Backend server running on port 5000
- [ ] Health check endpoint responding
- [ ] API endpoints returning data
- [ ] Frontend opens in browser
- [ ] API integration script added to HTML
- [ ] Search functionality working
- [ ] Autocomplete suggestions appearing
- [ ] Medicine details loading

## Congratulations! 🎉

If all checkboxes are checked, your MediView platform is fully operational!

You now have:
- ✅ A working backend API
- ✅ Advanced medicine search
- ✅ Smart autocomplete
- ✅ User authentication
- ✅ Complete medicine database
- ✅ Frontend-backend integration

Happy coding! 🚀
