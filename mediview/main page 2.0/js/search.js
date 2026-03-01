// Medicine database with detailed information
const medicines = [
    { 
        id: 1, 
        name: 'Paracetamol', 
        type: 'Tablet', 
        manufacturer: 'Cipla', 
        generic: true,
        price: '₹25.00',
        description: 'Paracetamol is a commonly used medicine that can help treat pain and reduce a high temperature (fever). It is typically used for mild or moderate pain.',
        strength: '500mg',
        dosageForm: 'Tablet',
        dosage: '500mg every 4-6 hours as needed',
        sideEffects: ['Nausea', 'Stomach pain', 'Loss of appetite', 'Dark urine', 'Yellowing of skin/eyes'],
        precautions: ['Do not exceed recommended dosage', 'Consult doctor if pregnant or breastfeeding', 'Avoid alcohol', 'Keep out of reach of children']
    },
    { 
        id: 2, 
        name: 'Ibuprofen', 
        type: 'Tablet', 
        manufacturer: 'Sun Pharma', 
        generic: true,
        price: '₹35.00',
        description: 'Ibuprofen is a nonsteroidal anti-inflammatory drug (NSAID) used to treat mild to moderate pain, and helps to relieve symptoms of arthritis, dysmenorrhea, fever, and gout.',
        strength: '400mg',
        dosageForm: 'Tablet',
        dosage: '200-400mg every 4-6 hours as needed',
        sideEffects: ['Heartburn', 'Dizziness', 'Stomach pain', 'Mild headache'],
        precautions: ['Take with food or milk', 'Avoid if allergic to aspirin', 'Do not take if pregnant']
    },
    { 
        id: 3, 
        name: 'Amoxicillin', 
        type: 'Capsule', 
        manufacturer: 'Dr. Reddy\'s', 
        generic: true,
        price: '₹40.00',
        description: 'Amoxicillin is an antibiotic used to treat various types of bacterial infections.',
        strength: '250mg',
        dosageForm: 'Capsule',
        dosage: 'As prescribed by doctor (typically 250-500mg every 8 hours)',
        sideEffects: ['Diarrhea', 'Nausea', 'Vomiting', 'Rash'],
        precautions: ['Complete the full course even if symptoms disappear']
    },
    { 
        id: 4, 
        name: 'Azithral 500', 
        type: 'Tablet', 
        manufacturer: 'Alembic', 
        generic: false,
        price: '₹120.00',
        description: 'Azithral 500 is an antibiotic used to treat various types of bacterial infections of the respiratory tract, ear, skin, and eye in adults and children.',
        strength: '500mg',
        dosageForm: 'Tablet',
        dosage: 'As prescribed by doctor',
        sideEffects: ['Diarrhea', 'Nausea', 'Stomach pain', 'Headache'],
        precautions: ['Complete the full course', 'Take 1 hour before or 2 hours after food', 'Inform doctor about liver problems']
    },
    { 
        id: 5, 
        name: 'Dolo 650', 
        type: 'Tablet', 
        manufacturer: 'Micro Labs', 
        generic: false,
        price: '₹30.00',
        description: 'Dolo 650 is used to relieve pain and reduce fever. It contains paracetamol as its active ingredient and is commonly used for headaches, muscle aches, and fever.',
        strength: '650mg',
        dosageForm: 'Tablet',
        dosage: '1-2 tablets every 4-6 hours as needed',
        sideEffects: ['Nausea', 'Stomach pain', 'Loss of appetite', 'Dark urine'],
        precautions: ['Do not take more than recommended', 'Avoid alcohol', 'Consult doctor if symptoms persist']
    }
];

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const searchInput = document.getElementById('medicineSearch');
    const searchBtn = document.querySelector('.search-icon');
    const uploadBtn = document.querySelector('.upload');
    const suggestionsContainer = document.getElementById('suggestionsContainer');
    const searchResults = document.getElementById('searchResults');
    const uploadBox = document.querySelector('.upload');
    const studentModeBtn = document.querySelector('.student');
    
    // State
    let isStudentMode = false;
    let searchTimeout;
    const DEBOUNCE_DELAY = 200; // Reduced for faster response
    let isImageSearchMode = false;

    // Initialize
    const searchContainer = document.querySelector('.search-container');
    const imageSearchContainer = document.querySelector('.image-search');
    searchContainer.classList.add('active');

    // Toggle student mode
    studentModeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        isStudentMode = !isStudentMode;
        studentModeBtn.classList.toggle('active', isStudentMode);
        
        if (isStudentMode) {
            // Add student-specific features
            addStudentFeatures();
        } else {
            // Remove student features
            removeStudentFeatures();
        }
    });

    // Toggle image upload
    uploadBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        isImageSearchMode = !isImageSearchMode;
        
        if (isImageSearchMode) {
            // Show image upload interface
            searchContainer.classList.remove('active');
            imageSearchContainer.classList.add('active');
            uploadBtn.classList.add('active');
        } else {
            // Return to text search
            searchContainer.classList.add('active');
            imageSearchContainer.classList.remove('active');
            uploadBtn.classList.remove('active');
            clearImagePreview();
        }
    });

    // Close image search when clicking outside
    document.addEventListener('click', (e) => {
        if (isImageSearchMode && !e.target.closest('.image-search') && e.target !== uploadBtn) {
            searchContainer.classList.add('active');
            imageSearchContainer.classList.remove('active');
            uploadBtn.classList.remove('active');
            isImageSearchMode = false;
            clearImagePreview();
        }
    });

    // Prevent clicks inside the image search container from closing it
    imageSearchContainer.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // Text search functionality with suggestions
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim().toLowerCase();
        
        // Clear previous timeout
        clearTimeout(searchTimeout);
        
        // If input is empty, hide suggestions and return
        if (!query) {
            hideSuggestions();
            return;
        }
        
        // Show loading state
        showLoadingSuggestions();
        
        // Debounce the search
        searchTimeout = setTimeout(() => {
            const results = searchMedicines(query);
            displaySuggestions(results);
        }, DEBOUNCE_DELAY);
    });
    
    // Handle search button click
    searchBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const query = searchInput.value.trim();
        if (query) {
            performTextSearch();
        }
    });
    
    // Handle Enter key
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const query = searchInput.value.trim();
            if (query) {
                performTextSearch();
            }
        }
    });
    
    // Close suggestions when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.modern-search')) {
            hideSuggestions();
        }
    });
    
    // Handle suggestion item click
    suggestionsContainer.addEventListener('click', (e) => {
        const suggestionItem = e.target.closest('.suggestion-item');
        if (suggestionItem) {
            const medicineName = suggestionItem.dataset.name;
            searchInput.value = medicineName;
            performTextSearch();
        }
    });

    // Image upload functionality
    uploadBox.addEventListener('click', (e) => {
        e.stopPropagation();
        imageUpload.click();
    });
    
    uploadBox.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.stopPropagation();
        uploadBox.style.borderColor = '#3b82f6';
        uploadBox.style.background = '#f8fafc';
    });
    
    uploadBox.addEventListener('dragleave', (e) => {
        e.stopPropagation();
        uploadBox.style.borderColor = '#d1d5db';
        uploadBox.style.background = 'white';
    });
    
    uploadBox.addEventListener('drop', (e) => {
        e.preventDefault();
        e.stopPropagation();
        uploadBox.style.borderColor = '#d1d5db';
        uploadBox.style.background = 'white';
        
        if (e.dataTransfer.files.length) {
            handleImageUpload(e.dataTransfer.files[0]);
        }
    });
    
    imageUpload.addEventListener('change', (e) => {
        if (e.target.files.length) {
            handleImageUpload(e.target.files[0]);
        }
    });
    
    // Handle search button click
    searchBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (isImageSearchMode && previewImage.src) {
            performImageSearch();
        } else {
            performTextSearch();
        }
    });
    
    // Handle Enter key in search input
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.stopPropagation();
            if (!isImageSearchMode) {
                performTextSearch();
            }
        }
    });

    // Functions
    function performTextSearch() {
        const query = searchInput.value.trim().toLowerCase();
        
        if (!query) {
            hideResults();
            hideSuggestions();
            return;
        }
        
        showLoading();
        hideSuggestions();
        
        // Simulate API call delay
        setTimeout(() => {
            const results = searchMedicines(query);
            displayResults(results);
        }, 300);
    }
    
    function performImageSearch() {
        if (!previewImage.src) return;
        
        showLoading();
        
        // Simulate image processing delay
        setTimeout(() => {
            // In a real app, you would send the image to your backend for processing
            // For now, we'll just search for a sample medicine
            const results = searchMedicines('paracetamol');
            displayResults(results);
        }, 1000);
    }
    
    function searchMedicines(query) {
        if (!query) return [];
        
        return medicines.filter(medicine => {
            const name = medicine.name.toLowerCase();
            // Only search in name for better suggestions
            return name.includes(query);
        });
    }
    
    function displaySuggestions(medicines) {
        if (!medicines || medicines.length === 0) {
            hideSuggestions();
            return;
        }
        
        // Group by first letter
        const grouped = medicines.reduce((acc, medicine) => {
            const firstLetter = medicine.name.charAt(0).toUpperCase();
            if (!acc[firstLetter]) {
                acc[firstLetter] = [];
            }
            acc[firstLetter].push(medicine);
            return acc;
        }, {});
        
        // Sort groups alphabetically
        const sortedGroups = Object.entries(grouped)
            .sort(([letterA], [letterB]) => letterA.localeCompare(letterB));
        
        // Generate HTML
        let html = '';
        sortedGroups.forEach(([letter, meds]) => {
            html += `<div class="suggestion-letter">${letter}</div>`;
            meds.forEach(med => {
                html += `
                    <div class="suggestion-item" data-name="${med.name}">
                        <div class="suggestion-name">${med.name}</div>
                        <div class="suggestion-type">${med.type}</div>
                    </div>
                `;
            });
        });
        
        suggestionsContainer.innerHTML = html;
        suggestionsContainer.classList.add('visible');
    }
    
    function showLoadingSuggestions() {
        suggestionsContainer.innerHTML = '<div class="suggestion-item">Searching...</div>';
        suggestionsContainer.classList.add('visible');
    }
    
    function hideSuggestions() {
        suggestionsContainer.classList.remove('visible');
    }
    
    function handleImageUpload(file) {
        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            // Create the image preview elements if they don't exist
            if (!imagePreview) {
                const previewContainer = document.createElement('div');
                previewContainer.className = 'image-preview';
                previewContainer.innerHTML = `
                    <img id="previewImage" src="" alt="Preview">
                    <button class="remove-image" id="removeImage">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                uploadBox.parentNode.insertBefore(previewContainer, uploadBox.nextSibling);
                
                // Add event listener for remove button
                const removeBtn = previewContainer.querySelector('.remove-image');
                removeBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    clearImagePreview();
                });
                
                // Show the preview
                previewImage = document.getElementById('previewImage');
                previewImage.src = e.target.result;
                previewContainer.style.display = 'block';
                uploadBox.style.display = 'none';
            } else {
                // Update existing preview
                previewImage.src = e.target.result;
                imagePreview.style.display = 'block';
                uploadBox.style.display = 'none';
            }
        };
        reader.readAsDataURL(file);
    }
    
    function clearImagePreview() {
        if (previewImage) previewImage.src = '';
        if (imagePreview) imagePreview.style.display = 'none';
        if (uploadBox) uploadBox.style.display = 'block';
        if (imageUpload) imageUpload.value = '';
    }
    
    function clearSearch() {
        searchInput.value = '';
        hideResults();
        clearImagePreview();
    }
    
    function hideResults() {
        if (searchResults) searchResults.style.display = 'none';
    }
    
    function showLoading() {
        if (searchResults) {
            searchResults.innerHTML = '<div class="loading">Searching...</div>';
            searchResults.style.display = 'block';
        }
    }
    
    function displayResults(results) {
        if (!searchResults) return;
        
        searchResults.innerHTML = '';
        
        if (!results || results.length === 0) {
            searchResults.innerHTML = `
                <div class="result-item no-results">
                    <div class="result-name">No results found</div>
                    <div class="result-type">Try different keywords or check spelling</div>
                </div>
            `;
        } else {
            results.forEach(medicine => {
                const resultItem = document.createElement('div');
                resultItem.className = 'result-item';
                resultItem.innerHTML = `
                    <div class="result-name">${highlightMatch(medicine.name, searchInput.value)}</div>
                    <div class="result-type">${medicine.type} • ${medicine.generic ? 'Generic' : 'Branded'}</div>
                    <div class="result-manufacturer">${medicine.manufacturer}</div>
                    <div class="result-description">${medicine.description}</div>
                    <div class="result-price">${medicine.price}</div>
                `;
                
                resultItem.addEventListener('click', () => {
                    selectMedicine(medicine);
                });
                
                searchResults.appendChild(resultItem);
            });
        }
        
        showResults();
    }
    
    function highlightMatch(text, query) {
        if (!query) return text;
        
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<span class="highlight">$1</span>');
    }
    
    function showResults() {
        searchResults.style.display = 'block';
        searchResults.classList.add('show');
    }
    
    function hideResults() {
        if (searchResults) {
            searchResults.classList.remove('show');
            setTimeout(() => {
                searchResults.style.display = 'none';
            }, 200);
        }
    }
    
    function clearSearch() {
        if (searchInput) searchInput.value = '';
        hideResults();
        hideSuggestions();
    }
    
    // Initialize the search interface
    showResults();

    function addStudentFeatures() {
        // Add any student-specific features here
        console.log('Student mode activated');
    }

    function removeStudentFeatures() {
        // Remove any student-specific features here
        console.log('Student mode deactivated');
    }

    // Close search results when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-container') && 
            !e.target.closest('.search-results') && 
            searchResults && searchResults.style.display === 'block') {
            hideResults();
        }
    });

    searchResults.addEventListener('click', (e) => {
        e.stopPropagation();
    });
});
