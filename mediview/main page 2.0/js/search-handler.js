document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('medicineSearch');
    const searchResults = document.getElementById('searchResults');
    const suggestionsContainer = document.getElementById('suggestionsContainer');
    
    // Use the global medicines array
    const medicines = window.medicines || [];
    
    if (medicines.length === 0) {
        console.error('No medicines found. Make sure medicines.js is loaded first.');
    }

    // Highlight matching text in search results with smart case and partial matches
    function highlightMatch(text, query) {
        if (!query || !text) return text || '';
        
        // Escape special regex characters
        const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        
        // Create a regex that matches whole words or parts of words
        const regex = new RegExp(`(${escapedQuery.split('').join('.*?')})`, 'i');
        
        // Split the text into parts, some of which will be highlighted
        const parts = text.split(regex);
        
        // Rebuild the string with highlights
        return parts.map((part, i) => 
            i % 2 === 0 ? part : `<span class="highlight">${part}</span>`
        ).join('');
    }

    // Advanced search function with fuzzy matching and better ranking
    function searchMedicines(query) {
        if (!query || query.trim() === '') return [];
        const searchTerm = query.toLowerCase().trim();
        const searchTerms = searchTerm.split(/\s+/); // Split into individual words
        
        // Score each medicine based on multiple factors
        const scoredResults = medicines.map(medicine => {
            let score = 0;
            const name = medicine.name.toLowerCase();
            const manufacturer = (medicine.manufacturer || '').toLowerCase();
            const type = (medicine.type || '').toLowerCase();
            const strength = (medicine.strength || '').toLowerCase();
            
            // Check each search term against all fields
            searchTerms.forEach(term => {
                if (term.length < 2) return; // Ignore very short terms
                
                // Exact matches (highest priority)
                if (name === term) score += 20;
                else if (manufacturer === term) score += 15;
                else if (type === term) score += 10;
                
                // Starts with term (high priority)
                if (name.startsWith(term)) score += 8;
                else if (manufacturer.startsWith(term)) score += 5;
                else if (type.startsWith(term)) score += 3;
                
                // Contains term (medium priority)
                if (name.includes(term)) score += 5;
                if (manufacturer.includes(term)) score += 3;
                if (type.includes(term)) score += 2;
                if (strength.includes(term)) score += 4;
                
                // Check for acronyms (e.g., 'pc' matches 'paracetamol')
                if (name.split(' ').some(word => word.startsWith(term[0]))) {
                    score += 2;
                }
            });
            
            // Bonus for exact strength match
            if (strength === searchTerm) score += 10;
            
            // Bonus for generic medicines (usually more popular)
            if (medicine.generic) score += 2;
            
            return { ...medicine, score };
        })
        .filter(item => item.score > 0) // Only include matches
        .sort((a, b) => {
            // First sort by score (descending)
            if (a.score !== b.score) return b.score - a.score;
            
            // If scores are equal, prefer exact matches in name
            const aNameMatch = a.name.toLowerCase() === searchTerm ? 1 : 0;
            const bNameMatch = b.name.toLowerCase() === searchTerm ? 1 : 0;
            if (aNameMatch !== bNameMatch) return bNameMatch - aNameMatch;
            
            // Then sort alphabetically
            return a.name.localeCompare(b.name);
        })
        .map(({ score, ...medicine }) => ({
            ...medicine,
            matchQuality: score > 15 ? 'high' : score > 5 ? 'medium' : 'low'
        }));
        
        // Remove duplicates based on medicine name
        const uniqueResults = [];
        const seenNames = new Set();
        
        for (const medicine of scoredResults) {
            const nameKey = medicine.name.toLowerCase();
            if (!seenNames.has(nameKey)) {
                seenNames.add(nameKey);
                uniqueResults.push(medicine);
            }
        }
        
        return uniqueResults.slice(0, 25); // Show top 25 unique results
    }

    // Display search suggestions
    function showSuggestions(suggestions) {
        if (!suggestions.length) {
            showNoResultsMessage();
            return;
        }

        // Sort by match quality and then alphabetically
        suggestions.sort((a, b) => {
            const qualityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
            if (qualityOrder[a.matchQuality] !== qualityOrder[b.matchQuality]) {
                return qualityOrder[b.matchQuality] - qualityOrder[a.matchQuality];
            }
            return a.name.localeCompare(b.name);
        });

        // Group by match quality
        const groupedByQuality = {
            high: suggestions.filter(m => m.matchQuality === 'high'),
            medium: suggestions.filter(m => m.matchQuality === 'medium'),
            low: suggestions.filter(m => m.matchQuality === 'low')
        };

        suggestionsContainer.innerHTML = '';
        
        // Add header with result count
        const header = document.createElement('div');
        header.className = 'suggestion-header';
        header.innerHTML = `
            <span>${suggestions.length} ${suggestions.length === 1 ? 'result' : 'results'} found</span>
            <span class="match-legend">
                <span class="match-dot high"></span> Exact 
                <span class="match-dot medium"></span> Close 
                <span class="match-dot low"></span> Partial
            </span>
        `;
        suggestionsContainer.appendChild(header);

        // Add sections for each match quality
        Object.entries(groupedByQuality).forEach(([quality, meds]) => {
            if (meds.length === 0) return;
            
            // Add section header
            const sectionHeader = document.createElement('div');
            sectionHeader.className = `suggestion-section-header ${quality}-bg`;
            sectionHeader.innerHTML = `
                <i class="fas ${getQualityIcon(quality)}"></i>
                ${quality.charAt(0).toUpperCase() + quality.slice(1)} Matches (${meds.length})
            `;
            suggestionsContainer.appendChild(sectionHeader);
            
            // Add medicines for this quality
            meds.forEach((medicine, index) => {
                const div = document.createElement('div');
                div.className = `suggestion-item ${quality}-match`;
                div.setAttribute('data-id', medicine.id);
                div.setAttribute('role', 'option');
                div.setAttribute('aria-selected', 'false');
                div.setAttribute('aria-label', `${medicine.name}, ${medicine.type}, ${medicine.manufacturer}`);
                
                div.innerHTML = `
                    <div class="suggestion-left">
                        <div class="suggestion-name">
                            <span class="suggestion-match-type">${getMatchType(medicine, searchInput.value.trim())}</span>
                            ${highlightMatch(medicine.name, searchInput.value.trim())}
                            ${medicine.generic ? '<span class="suggestion-quick-action"><i class="fas fa-tags"></i> Generic</span>' : ''}
                        </div>
                        <div class="suggestion-details">
                            <span class="suggestion-type">
                                <i class="fas fa-pills"></i> ${medicine.type || 'Medicine'}
                                ${medicine.strength ? `<span class="suggestion-strength">${medicine.strength}</span>` : ''}
                            </span>
                            <span class="suggestion-manufacturer">
                                <i class="fas fa-industry"></i> ${medicine.manufacturer || 'N/A'}
                            </span>
                        </div>
                    </div>
                `;
                
                // Add click handler for the whole item
                div.addEventListener('click', (e) => {
                    selectMedicine(medicine);
                });
                
                // Add keyboard navigation
                div.setAttribute('tabindex', '0');
                div.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        selectMedicine(medicine);
                    } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                        navigateSuggestions(e);
                    }
                });
                
                suggestionsContainer.appendChild(div);
            });
        });
        

        
        // Show the first suggestion as focused if using keyboard
        const firstSuggestion = suggestionsContainer.querySelector('.suggestion-item');
        if (firstSuggestion) {
            firstSuggestion.setAttribute('aria-selected', 'true');
            firstSuggestion.classList.add('focused');
        }
        
        suggestionsContainer.style.display = 'block';
    }
    
    // Helper function to get icon based on match quality
    function getQualityIcon(quality) {
        const icons = {
            'high': 'fa-check-circle',
            'medium': 'fa-star',
            'low': 'fa-info-circle'
        };
        return icons[quality] || 'fa-pills';
    }
    
    // Helper function to determine match type
    function getMatchType(medicine, query) {
        const name = medicine.name.toLowerCase();
        if (name === query.toLowerCase()) return '<span class="match-type">Exact Match</span>';
        if (name.startsWith(query.toLowerCase())) return '<span class="match-type">Starts With</span>';
        if (name.includes(query.toLowerCase())) return '<span class="match-type">Contains</span>';
        return '';
    }
    
    // Show no results message
    function showNoResultsMessage() {
        suggestionsContainer.innerHTML = `
            <div class="no-results">
                <div class="no-results-icon">
                    <i class="fas fa-search"></i>
                </div>
                <h3>No results found</h3>
                <p>We couldn't find any medicines matching "${searchInput.value}"</p>
            </div>
        `;
        
        suggestionsContainer.style.display = 'block';
    }
    
    // Handle keyboard navigation
    function navigateSuggestions(e) {
        const current = document.activeElement;
        const items = Array.from(suggestionsContainer.querySelectorAll('.suggestion-item'));
        const currentIndex = items.indexOf(current);
        
        if (e.key === 'ArrowDown' && currentIndex < items.length - 1) {
            e.preventDefault();
            items[currentIndex + 1].focus();
            items[currentIndex + 1].setAttribute('aria-selected', 'true');
            current.setAttribute('aria-selected', 'false');
        } else if (e.key === 'ArrowUp' && currentIndex > 0) {
            e.preventDefault();
            items[currentIndex - 1].focus();
            items[currentIndex - 1].setAttribute('aria-selected', 'true');
            current.setAttribute('aria-selected', 'false');
        } else if (e.key === 'Escape') {
            searchInput.focus();
            suggestionsContainer.style.display = 'none';
        }
    }
    
    // Add to cart function
    function addToCart(medicine) {
        // Add your cart logic here
        console.log('Added to cart:', medicine.name);
        // Show a temporary notification
        const notification = document.createElement('div');
        notification.className = 'add-to-cart-notification';
        notification.textContent = `Added ${medicine.name} to cart`;
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.classList.add('show');
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            }, 2000);
        }, 10);
    }

    // Handle medicine selection
    function selectMedicine(medicine) {
        if (medicine) {
            // Store the selected medicine in session storage
            sessionStorage.setItem('currentMedicine', JSON.stringify(medicine));
            // Navigate to medicine details page
            window.location.href = 'medicine-details.html';
        }
    }

    // Event listeners
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        if (query.length < 2) {
            suggestionsContainer.style.display = 'none';
            return;
        }
        const results = searchMedicines(query);
        showSuggestions(results);
    });

    // Hide suggestions when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-container')) {
            suggestionsContainer.style.display = 'none';
        }
    });

    // Handle search form submission
    const searchForm = document.querySelector('.search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const query = searchInput.value.trim();
            if (query) {
                const results = searchMedicines(query);
                if (results.length > 0) {
                    selectMedicine(results[0]);
                }
            }
        });
    }
});
