╔══════════════════════════════════════════════════════════════════╗
║     How to Connect Frontend to Backend - COPY & PASTE            ║
╚══════════════════════════════════════════════════════════════════╝

STEP 1: Open this file in your editor
────────────────────────────────────────────────────────────────────
File: mediview/main page 2.0/index.html


STEP 2: Find the script section (around line 1154)
────────────────────────────────────────────────────────────────────
Look for these lines:

    <script src="script.js"></script>
    <script src="animation.js"></script>
    <script src="js/medicines.js"></script>
    <script src="js/search.js"></script>
    <script src="js/search-handler.js"></script>
    <script src="js/advanced-features.js"></script>
    <script src="js/ai-search.js"></script>
    <script src="js/health-analytics.js"></script>


STEP 3: Add this ONE line at the end
────────────────────────────────────────────────────────────────────
<script src="js/api-integration.js"></script>


STEP 4: The complete section should look like this:
────────────────────────────────────────────────────────────────────
    <script src="script.js"></script>
    <script src="animation.js"></script>
    <script src="js/medicines.js"></script>
    <script src="js/search.js"></script>
    <script src="js/search-handler.js"></script>
    <script src="js/advanced-features.js"></script>
    <script src="js/ai-search.js"></script>
    <script src="js/health-analytics.js"></script>
    <script src="js/api-integration.js"></script>  ← ADD THIS LINE


STEP 5: Save the file and refresh your browser
────────────────────────────────────────────────────────────────────

That's it! Your frontend is now connected to the backend API!


╔══════════════════════════════════════════════════════════════════╗
║     What This Does                                                ║
╚══════════════════════════════════════════════════════════════════╝

✓ Connects your search box to the backend API
✓ Enables real-time autocomplete suggestions
✓ Loads medicine details from the server
✓ Provides user authentication
✓ Automatically falls back to local data if server is offline


╔══════════════════════════════════════════════════════════════════╗
║     Test It                                                       ║
╚══════════════════════════════════════════════════════════════════╝

1. Make sure backend is running (npm start in backend folder)
2. Open mediview/main page 2.0/index.html in browser
3. Type "para" in the search box
4. You should see autocomplete suggestions!
5. Open browser DevTools (F12) → Network tab to see API calls


╔══════════════════════════════════════════════════════════════════╗
║     Verify It's Working                                           ║
╚══════════════════════════════════════════════════════════════════╝

Open Browser Console (F12) and you should see:
- No errors
- API calls to localhost:5000
- Successful responses (status 200)

If you see "Failed to fetch":
- Check that backend server is running
- Visit http://localhost:5000/api/health to verify


╔══════════════════════════════════════════════════════════════════╗
║     Alternative: If You Don't Want to Edit HTML                   ║
╚══════════════════════════════════════════════════════════════════╝

You can also add it directly in the browser console for testing:

var script = document.createElement('script');
script.src = 'js/api-integration.js';
document.body.appendChild(script);

Then try searching!


╔══════════════════════════════════════════════════════════════════╗
║     File Location Reference                                       ║
╚══════════════════════════════════════════════════════════════════╝

Backend API:
  backend/server.js (running on port 5000)

Frontend Integration:
  mediview/main page 2.0/js/api-integration.js (already created)

HTML File to Edit:
  mediview/main page 2.0/index.html (add 1 line)


Done! 🎉
