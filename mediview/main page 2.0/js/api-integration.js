// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// API Helper Functions
class MediViewAPI {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('authToken');
  }

  // Set auth token
  setToken(token) {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  // Clear auth token
  clearToken() {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  // Get headers
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json'
    };
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  // Generic fetch wrapper
  async request(endpoint, options = {}) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers: this.getHeaders()
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Request failed');
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Medicine APIs
  async searchMedicines(query, limit = 10) {
    return this.request(`/medicines/search?q=${encodeURIComponent(query)}&limit=${limit}`);
  }

  async getAutocompleteSuggestions(query, limit = 5) {
    return this.request(`/medicines/suggest/autocomplete?q=${encodeURIComponent(query)}&limit=${limit}`);
  }

  async getMedicineById(id) {
    return this.request(`/medicines/${id}`);
  }

  async getSimilarMedicines(id) {
    return this.request(`/medicines/${id}/similar`);
  }

  async getAlternativeMedicines(id) {
    return this.request(`/medicines/${id}/alternatives`);
  }

  async getAllMedicines(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/medicines?${params}`);
  }

  // Auth APIs
  async register(email, password, name) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name })
    });
    
    if (data.token) {
      this.setToken(data.token);
    }
    
    return data;
  }

  async login(email, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    
    if (data.token) {
      this.setToken(data.token);
    }
    
    return data;
  }

  logout() {
    this.clearToken();
  }

  // User APIs
  async getUserProfile() {
    return this.request('/users/profile');
  }

  async updateUserProfile(userData) {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(userData)
    });
  }

  // Health check
  async checkHealth() {
    return this.request('/health');
  }
}

// Create global API instance
const api = new MediViewAPI();

// Enhanced search functionality with backend integration
async function enhancedMedicineSearch(query) {
  if (!query || query.trim().length < 2) {
    return [];
  }

  try {
    const results = await api.searchMedicines(query);
    return results;
  } catch (error) {
    console.error('Search error:', error);
    // Fallback to local search if API fails
    return fallbackLocalSearch(query);
  }
}

// Enhanced autocomplete with backend
async function enhancedAutocomplete(query) {
  if (!query || query.trim().length < 2) {
    return [];
  }

  try {
    const suggestions = await api.getAutocompleteSuggestions(query);
    return suggestions;
  } catch (error) {
    console.error('Autocomplete error:', error);
    return [];
  }
}

// Fallback local search (when API is unavailable)
function fallbackLocalSearch(query) {
  const localMedicines = [
    { name: 'Paracetamol', brandNames: ['Tylenol', 'Calpol'], type: 'Pain Relief', icon: 'fa-pills' },
    { name: 'Amoxicillin', brandNames: ['Amoxil'], type: 'Antibiotic', icon: 'fa-pills' },
    { name: 'Omeprazole', brandNames: ['Prilosec'], type: 'Antacid', icon: 'fa-pills' },
    { name: 'Cetirizine', brandNames: ['Zyrtec'], type: 'Antihistamine', icon: 'fa-pills' },
    { name: 'Metformin', brandNames: ['Glucophage'], type: 'Antidiabetic', icon: 'fa-pills' },
    { name: 'Ibuprofen', brandNames: ['Advil', 'Motrin'], type: 'Pain Relief', icon: 'fa-pills' }
  ];

  const searchTerm = query.toLowerCase();
  return localMedicines.filter(med => 
    med.name.toLowerCase().includes(searchTerm) ||
    med.brandNames.some(brand => brand.toLowerCase().includes(searchTerm))
  );
}

// Update the existing search input handler
if (typeof searchInput !== 'undefined' && searchInput) {
  let debounceTimer;
  
  searchInput.addEventListener('input', async (e) => {
    clearTimeout(debounceTimer);
    
    debounceTimer = setTimeout(async () => {
      const query = e.target.value;
      
      if (query.trim().length < 2) {
        if (suggestionsContainer) {
          suggestionsContainer.classList.remove('active');
        }
        return;
      }

      try {
        const suggestions = await enhancedAutocomplete(query);
        displaySuggestions(suggestions, query);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    }, 300); // Debounce for 300ms
  });
}

// Display suggestions
function displaySuggestions(suggestions, query) {
  if (!suggestionsContainer) return;

  if (suggestions.length === 0) {
    suggestionsContainer.innerHTML = `
      <div class="suggestion-item no-results">
        <i class="fas fa-search"></i>
        <div class="medicine-info">
          <div class="medicine-name">No medicines found</div>
          <div class="medicine-type">Try different keywords</div>
        </div>
      </div>
    `;
    suggestionsContainer.classList.add('active');
    return;
  }

  suggestionsContainer.innerHTML = suggestions
    .map(medicine => createSuggestionHTML(medicine, query))
    .join('');
  
  suggestionsContainer.classList.add('active');

  // Add click handlers
  suggestionsContainer.querySelectorAll('.suggestion-item').forEach(item => {
    item.addEventListener('click', () => {
      const medicineId = item.dataset.medicineId;
      const medicineName = item.querySelector('.medicine-name').textContent;
      
      searchInput.value = medicineName;
      suggestionsContainer.classList.remove('active');
      
      // Navigate to medicine details
      const studentMode = sessionStorage.getItem('studentMode') === 'true';
      const studentParam = studentMode ? '&student=true' : '';
      window.location.href = `medicine-details.html?id=${medicineId}${studentParam}`;
    });
  });
}

// Create suggestion HTML
function createSuggestionHTML(medicine, query) {
  const highlightedName = highlightMatch(medicine.name, query);
  const brandNamesText = medicine.brandNames.join(', ');
  
  return `
    <div class="suggestion-item" data-medicine-id="${medicine.id}">
      <i class="fas ${medicine.icon}"></i>
      <div class="medicine-info">
        <div class="medicine-name">${highlightedName}</div>
        <div class="medicine-type">${medicine.type} - ${medicine.strength}</div>
        <div class="medicine-brands">${brandNamesText}</div>
      </div>
    </div>
  `;
}

// Highlight matching text
function highlightMatch(text, query) {
  if (!query) return text;
  
  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { api, enhancedMedicineSearch, enhancedAutocomplete };
}
