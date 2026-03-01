// AI-Powered Search Enhancement for MediView
class AISearchEngine {
    constructor() {
        this.searchHistory = this.loadSearchHistory();
        this.userPreferences = this.loadUserPreferences();
        this.initializeAI();
    }

    loadSearchHistory() {
        return JSON.parse(localStorage.getItem('searchHistory') || '[]');
    }

    loadUserPreferences() {
        return JSON.parse(localStorage.getItem('userPreferences') || '{}');
    }

    initializeAI() {
        // Initialize AI search capabilities
        this.synonyms = this.loadSynonyms();
        this.medicalTerms = this.loadMedicalTerms();
    }

    loadSynonyms() {
        return {
            'pain': ['ache', 'hurt', 'discomfort', 'soreness'],
            'fever': ['temperature', 'pyrexia', 'hyperthermia'],
            'headache': ['migraine', 'cephalgia', 'head pain'],
            'stomach': ['gastric', 'abdominal', 'belly', 'tummy'],
            'cold': ['flu', 'influenza', 'respiratory infection']
        };
    }

    loadMedicalTerms() {
        return {
            'analgesic': 'pain reliever',
            'antipyretic': 'fever reducer',
            'antibiotic': 'infection fighter',
            'antihistamine': 'allergy medicine',
            'nsaid': 'anti-inflammatory'
        };
    }

    enhancedSearch(query, medicines) {
        // Expand query with synonyms and medical terms
        const expandedQuery = this.expandQuery(query);
        
        // Perform fuzzy matching
        const results = this.fuzzySearch(expandedQuery, medicines);
        
        // Apply AI ranking
        const rankedResults = this.rankResults(results, query);
        
        // Save search for learning
        this.saveSearch(query, rankedResults.length);
        
        return rankedResults;
    }

    expandQuery(query) {
        let expandedTerms = [query.toLowerCase()];
        
        // Add synonyms
        Object.entries(this.synonyms).forEach(([term, synonyms]) => {
            if (query.toLowerCase().includes(term)) {
                expandedTerms.push(...synonyms);
            }
        });
        
        // Add medical term translations
        Object.entries(this.medicalTerms).forEach(([medical, common]) => {
            if (query.toLowerCase().includes(common)) {
                expandedTerms.push(medical);
            }
            if (query.toLowerCase().includes(medical)) {
                expandedTerms.push(common);
            }
        });
        
        return expandedTerms;
    }

    fuzzySearch(expandedQuery, medicines) {
        const results = [];
        
        medicines.forEach(medicine => {
            let score = 0;
            const name = medicine.name.toLowerCase();
            const uses = (medicine.uses || '').toLowerCase();
            const category = (medicine.category || '').toLowerCase();
            
            expandedQuery.forEach(term => {
                // Exact matches get highest score
                if (name.includes(term)) score += 10;
                if (uses.includes(term)) score += 8;
                if (category.includes(term)) score += 6;
                
                // Fuzzy matching for typos
                if (this.levenshteinDistance(term, name) <= 2) score += 5;
            });
            
            if (score > 0) {
                results.push({ ...medicine, searchScore: score });
            }
        });
        
        return results;
    }

    levenshteinDistance(str1, str2) {
        const matrix = [];
        
        for (let i = 0; i <= str2.length; i++) {
            matrix[i] = [i];
        }
        
        for (let j = 0; j <= str1.length; j++) {
            matrix[0][j] = j;
        }
        
        for (let i = 1; i <= str2.length; i++) {
            for (let j = 1; j <= str1.length; j++) {
                if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1
                    );
                }
            }
        }
        
        return matrix[str2.length][str1.length];
    }

    rankResults(results, originalQuery) {
        return results.sort((a, b) => {
            // Primary sort by search score
            if (a.searchScore !== b.searchScore) {
                return b.searchScore - a.searchScore;
            }
            
            // Secondary sort by user preferences
            const aPreferenceScore = this.getPreferenceScore(a);
            const bPreferenceScore = this.getPreferenceScore(b);
            
            if (aPreferenceScore !== bPreferenceScore) {
                return bPreferenceScore - aPreferenceScore;
            }
            
            // Tertiary sort alphabetically
            return a.name.localeCompare(b.name);
        });
    }

    getPreferenceScore(medicine) {
        let score = 0;
        
        // Prefer generic medicines if user prefers them
        if (this.userPreferences.preferGeneric && medicine.generic) {
            score += 2;
        }
        
        // Prefer previously searched medicines
        if (this.searchHistory.some(search => search.medicine === medicine.name)) {
            score += 1;
        }
        
        return score;
    }

    saveSearch(query, resultCount) {
        const search = {
            query,
            resultCount,
            timestamp: new Date().toISOString()
        };
        
        this.searchHistory.unshift(search);
        this.searchHistory = this.searchHistory.slice(0, 100); // Keep last 100 searches
        
        localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory));
    }

    getSearchSuggestions(partialQuery) {
        const suggestions = [];
        
        // Add medical term suggestions only (no history)
        Object.keys(this.synonyms).forEach(term => {
            if (term.startsWith(partialQuery.toLowerCase())) {
                suggestions.push({
                    text: term,
                    type: 'medical',
                    icon: 'fa-stethoscope'
                });
            }
        });
        
        return suggestions.slice(0, 5);
    }
}

// Initialize AI search engine
window.aiSearchEngine = new AISearchEngine();

// Smart Auto-complete System
class SmartAutoComplete {
    constructor() {
        this.suggestions = [];
        this.currentIndex = -1;
        this.isVisible = false;
    }

    generateSuggestions(query, medicines) {
        if (!query || query.length < 2) {
            return [];
        }

        const suggestions = [];
        
        // Get AI-enhanced search results
        const aiResults = window.aiSearchEngine.enhancedSearch(query, medicines);
        
        // Add top medicine suggestions
        aiResults.slice(0, 5).forEach(medicine => {
            suggestions.push({
                type: 'medicine',
                text: medicine.name,
                subtitle: medicine.category || medicine.type,
                icon: 'fa-pills',
                data: medicine
            });
        });
        
        // Add search history suggestions
        const historySuggestions = window.aiSearchEngine.getSearchSuggestions(query);
        suggestions.push(...historySuggestions);
        
        // Add medical condition suggestions
        const conditionSuggestions = this.getConditionSuggestions(query);
        suggestions.push(...conditionSuggestions);
        
        return suggestions;
    }

    getConditionSuggestions(query) {
        const conditions = [
            { name: 'headache', icon: 'fa-head-side-cough' },
            { name: 'fever', icon: 'fa-thermometer-half' },
            { name: 'cold', icon: 'fa-snowflake' },
            { name: 'cough', icon: 'fa-lungs' },
            { name: 'stomach pain', icon: 'fa-stomach' },
            { name: 'allergy', icon: 'fa-allergies' }
        ];
        
        return conditions
            .filter(condition => condition.name.includes(query.toLowerCase()))
            .map(condition => ({
                type: 'condition',
                text: `Medicines for ${condition.name}`,
                subtitle: 'Medical condition',
                icon: condition.icon
            }));
    }

    showSuggestions(suggestions, container) {
        if (!container || suggestions.length === 0) {
            this.hideSuggestions(container);
            return;
        }

        this.suggestions = suggestions;
        this.currentIndex = -1;
        this.isVisible = true;

        let html = '';
        suggestions.forEach((suggestion, index) => {
            html += `
                <div class="autocomplete-item" data-index="${index}">
                    <i class="fas ${suggestion.icon}"></i>
                    <div class="suggestion-content">
                        <div class="suggestion-text">${this.highlightMatch(suggestion.text, this.currentQuery)}</div>
                        ${suggestion.subtitle ? `<div class="suggestion-subtitle">${suggestion.subtitle}</div>` : ''}
                    </div>
                    <div class="suggestion-type">${suggestion.type}</div>
                </div>
            `;
        });

        container.innerHTML = html;
        container.style.display = 'block';
        
        // Add click listeners
        container.querySelectorAll('.autocomplete-item').forEach(item => {
            item.addEventListener('click', () => {
                const index = parseInt(item.dataset.index);
                this.selectSuggestion(index);
            });
        });
    }

    hideSuggestions(container) {
        if (container) {
            container.style.display = 'none';
        }
        this.isVisible = false;
        this.currentIndex = -1;
    }

    handleKeyNavigation(event) {
        if (!this.isVisible || this.suggestions.length === 0) return false;

        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault();
                this.currentIndex = Math.min(this.currentIndex + 1, this.suggestions.length - 1);
                this.updateSelection();
                return true;
                
            case 'ArrowUp':
                event.preventDefault();
                this.currentIndex = Math.max(this.currentIndex - 1, -1);
                this.updateSelection();
                return true;
                
            case 'Enter':
                event.preventDefault();
                if (this.currentIndex >= 0) {
                    this.selectSuggestion(this.currentIndex);
                }
                return true;
                
            case 'Escape':
                this.hideSuggestions(document.getElementById('suggestionsContainer'));
                return true;
        }
        
        return false;
    }

    updateSelection() {
        const items = document.querySelectorAll('.autocomplete-item');
        items.forEach((item, index) => {
            if (index === this.currentIndex) {
                item.classList.add('selected');
            } else {
                item.classList.remove('selected');
            }
        });
    }

    selectSuggestion(index) {
        if (index < 0 || index >= this.suggestions.length) return;
        
        const suggestion = this.suggestions[index];
        const searchInput = document.getElementById('medicineSearch');
        
        if (searchInput) {
            searchInput.value = suggestion.text;
            
            // If it's a medicine suggestion, navigate to details
            if (suggestion.type === 'medicine' && suggestion.data) {
                if (window.selectMedicine) {
                    window.selectMedicine(suggestion.data);
                }
            } else {
                // Trigger search
                searchInput.dispatchEvent(new Event('input', { bubbles: true }));
            }
        }
        
        this.hideSuggestions(document.getElementById('suggestionsContainer'));
    }

    highlightMatch(text, query) {
        if (!query) return text;
        
        const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }
}

// Initialize enhanced search features
document.addEventListener('DOMContentLoaded', function() {
    window.smartAutoComplete = new SmartAutoComplete();
    
    // Integrate with existing search functionality
    const searchInput = document.getElementById('medicineSearch');
    const suggestionsContainer = document.getElementById('suggestionsContainer');
    
    if (searchInput && suggestionsContainer) {
        let searchTimeout;
        
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            const query = e.target.value.trim();
            
            if (query.length < 2) {
                window.smartAutoComplete.hideSuggestions(suggestionsContainer);
                return;
            }
            
            searchTimeout = setTimeout(() => {
                const medicines = window.medicines || [];
                const suggestions = window.smartAutoComplete.generateSuggestions(query, medicines);
                window.smartAutoComplete.currentQuery = query;
                window.smartAutoComplete.showSuggestions(suggestions, suggestionsContainer);
            }, 200);
        });
        
        searchInput.addEventListener('keydown', (e) => {
            window.smartAutoComplete.handleKeyNavigation(e);
        });
        
        // Hide suggestions when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-container')) {
                window.smartAutoComplete.hideSuggestions(suggestionsContainer);
            }
        });
    }
    

});

// Export for global use
window.SmartAutoComplete = SmartAutoComplete;