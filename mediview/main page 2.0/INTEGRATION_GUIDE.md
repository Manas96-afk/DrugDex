# Frontend Integration Guide

## Add API Integration to Your HTML

Add this script tag to your `index.html` file, right after the existing script tags (around line 1154):

```html
<!-- Add this line after the existing scripts -->
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
<!-- NEW: API Integration -->
<script src="js/api-integration.js"></script>
```

## How It Works

The `api-integration.js` file automatically:

1. **Replaces the local medicine search** with backend API calls
2. **Provides autocomplete suggestions** from the server
3. **Handles authentication** (login/register)
4. **Falls back to local search** if the backend is unavailable

## Using the API in Your Code

### Search Medicines

```javascript
// The search input will automatically use the backend API
// No changes needed to existing code!

// Or call directly:
const results = await api.searchMedicines('paracetamol');
console.log(results);
```

### Get Autocomplete Suggestions

```javascript
const suggestions = await api.getAutocompleteSuggestions('para');
console.log(suggestions);
```

### Get Medicine Details

```javascript
const medicine = await api.getMedicineById('paracetamol-500');
console.log(medicine);
```

### User Authentication

```javascript
// Register
try {
  const result = await api.register('user@example.com', 'password123', 'John Doe');
  console.log('Registered:', result.user);
} catch (error) {
  console.error('Registration failed:', error.message);
}

// Login
try {
  const result = await api.login('user@example.com', 'password123');
  console.log('Logged in:', result.user);
} catch (error) {
  console.error('Login failed:', error.message);
}

// Logout
api.logout();
```

### Get Similar Medicines

```javascript
const similar = await api.getSimilarMedicines('paracetamol-500');
console.log(similar);
```

### Get Alternative Medicines

```javascript
const alternatives = await api.getAlternativeMedicines('paracetamol-500');
console.log(alternatives);
```

## Testing

1. **Start the backend server:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Open your website** in a browser

3. **Try searching** for medicines - you should see results from the backend!

4. **Check the browser console** for API calls and responses

## Offline Mode

The integration includes automatic fallback:
- If the backend is unavailable, it uses local medicine data
- No errors shown to users
- Seamless experience

## Configuration

To change the API URL, edit `js/api-integration.js`:

```javascript
const API_BASE_URL = 'http://localhost:5000/api';
// Change to your production URL when deploying
```

## Troubleshooting

### "Failed to fetch" Error
- Make sure the backend server is running
- Check that the API_BASE_URL is correct
- Check browser console for CORS errors

### No Suggestions Appearing
- Open browser DevTools → Network tab
- Check if API calls are being made
- Verify the backend is responding

### Authentication Not Working
- Check that JWT_SECRET is set in backend `.env`
- Verify the token is being stored in localStorage
- Check browser console for errors
