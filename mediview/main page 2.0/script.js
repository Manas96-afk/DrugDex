// Enhanced Menu Functionality
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menuToggle');
    const menuCloseBtn = document.getElementById('menuCloseBtn');
    const mainNav = document.getElementById('mainNav');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const body = document.body;
    const navLinks = document.querySelectorAll('.main-nav a, .auth-buttons .btn');

    // Ensure all elements exist
    if (!menuToggle || !mainNav || !sidebarOverlay) {
        console.error('Menu elements not found');
        return;
    }

    // Initial setup
    menuToggle.setAttribute('aria-expanded', 'false');
    mainNav.setAttribute('data-visible', 'false');
    sidebarOverlay.style.display = 'none';
    sidebarOverlay.classList.remove('active');

    // Enhanced toggle menu function
    function toggleMenu() {
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        const newState = !isExpanded;

        if (newState) {
            openMenu();
        } else {
            closeMenu();
        }
    }

    // Open menu function
    function openMenu() {
        // Update attributes
        menuToggle.setAttribute('aria-expanded', 'true');
        mainNav.setAttribute('data-visible', 'true');
        menuToggle.setAttribute('aria-label', 'Close navigation menu');
        
        // Add classes and show elements
        body.classList.add('menu-open');
        sidebarOverlay.style.display = 'block';
        
        // Force reflow before adding active class
        sidebarOverlay.offsetHeight;
        
        // Add active class for animation
        requestAnimationFrame(() => {
            sidebarOverlay.classList.add('active');
        });

        // Update menu icon with animation
        const icon = menuToggle.querySelector('i');
        if (icon) {
            icon.style.transform = 'rotate(90deg)';
            setTimeout(() => {
                icon.className = 'fas fa-times';
                icon.style.transform = 'rotate(0deg)';
            }, 150);
        }

        // Prevent body scroll
        body.style.overflow = 'hidden';
    }

    // Enhanced close menu function
    function closeMenu(event) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }

        // Update attributes
        menuToggle.setAttribute('aria-expanded', 'false');
        mainNav.setAttribute('data-visible', 'false');
        menuToggle.setAttribute('aria-label', 'Open navigation menu');
        
        // Remove classes
        body.classList.remove('menu-open');
        sidebarOverlay.classList.remove('active');
        
        // Update menu icon with animation
        const icon = menuToggle.querySelector('i');
        if (icon) {
            icon.style.transform = 'rotate(-90deg)';
            setTimeout(() => {
                icon.className = 'fas fa-bars';
                icon.style.transform = 'rotate(0deg)';
            }, 150);
        }

        // Hide overlay after animation
        setTimeout(() => {
            if (menuToggle.getAttribute('aria-expanded') === 'false') {
                sidebarOverlay.style.display = 'none';
            }
        }, 300);

        // Restore body scroll
        body.style.overflow = '';
    }

    // Event listeners with improved handling
    if (menuToggle) {
        menuToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleMenu();
        });

        // Add visual feedback
        menuToggle.addEventListener('mousedown', () => {
            menuToggle.style.transform = 'scale(0.95)';
        });

        menuToggle.addEventListener('mouseup', () => {
            menuToggle.style.transform = 'scale(1)';
        });

        menuToggle.addEventListener('mouseleave', () => {
            menuToggle.style.transform = 'scale(1)';
        });
    }

    if (menuCloseBtn) {
        menuCloseBtn.addEventListener('click', closeMenu);
    }

    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', (e) => {
            if (e.target === sidebarOverlay) {
                closeMenu();
            }
        });
    }

    // Close menu when clicking nav links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            if (link.tagName === 'A') {
                link.classList.add('active');
            }
            
            // Add click animation
            link.style.transform = 'scale(0.95)';
            setTimeout(() => {
                link.style.transform = 'scale(1)';
            }, 100);
            
            // Handle different menu items
            const linkText = link.textContent.trim();
            handleMenuClick(linkText);
            
            // Close menu after short delay
            setTimeout(() => {
                closeMenu();
            }, 200);
        });
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
            closeMenu();
        }
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && menuToggle.getAttribute('aria-expanded') === 'true') {
            closeMenu();
        }
    });

    // Prevent menu from staying open on page load
    window.addEventListener('load', () => {
        if (menuToggle.getAttribute('aria-expanded') === 'true') {
            closeMenu();
        }
    });
});

// Handle menu item clicks
function handleMenuClick(linkText) {
    console.log('Menu item clicked:', linkText);
    
    // Show notification for different menu items
    const notifications = {
        'Home': 'Welcome to MediView Home',
        'Find Doctors': 'Searching for available doctors...',
        'Medicines': 'Loading medicine database...',
        'Appointments': 'Opening appointment scheduler...',
        'Health Check': 'Starting health assessment...',
        'Hospitals': 'Finding nearby hospitals...',
        'Emergency': 'Emergency services - Call 108 immediately!',
        'Health Reports': 'Loading your health reports...',
        'Settings': 'Opening settings panel...',
        'Contact Us': 'Loading contact information...'
    };
    
    const message = notifications[linkText] || `Loading ${linkText}...`;
    showNotification(message, linkText === 'Emergency' ? 'error' : 'info');
    
    // Special handling for emergency
    if (linkText === 'Emergency') {
        setTimeout(() => {
            if (confirm('This is for emergency services. Do you want to call 108?')) {
                window.open('tel:108');
            }
        }, 1000);
    }
}

// Simple notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(n => n.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'error' ? 'fa-exclamation-triangle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 4000);
}

// Scroll to top button functionality
const scrollToTopBtn = document.getElementById('scroll-to-top');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollToTopBtn.classList.add('visible');
    } else {
        scrollToTopBtn.classList.remove('visible');
    }
});

scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Header stays fixed at top - no hide/show on scroll

// Sample medicine database with brand names
const medicines = [
    { name: 'Tylenol (Paracetamol 500mg)', type: 'Pain Relief', icon: 'fa-pills' },
    { name: 'Amoxil (Amoxicillin 250mg)', type: 'Antibiotic', icon: 'fa-pills' },
    { name: 'Prilosec (Omeprazole 20mg)', type: 'Antacid', icon: 'fa-pills' },
    { name: 'Zyrtec (Cetirizine 10mg)', type: 'Antihistamine', icon: 'fa-pills' },
    { name: 'Glucophage (Metformin 500mg)', type: 'Antidiabetic', icon: 'fa-pills' },
    { name: 'Lipitor (Atorvastatin 20mg)', type: 'Cholesterol', icon: 'fa-pills' },
    { name: 'Norvasc (Amlodipine 5mg)', type: 'Blood Pressure', icon: 'fa-pills' },
    { name: 'Lopressor (Metoprolol 25mg)', type: 'Beta Blocker', icon: 'fa-pills' },
    { name: 'Protonix (Pantoprazole 40mg)', type: 'Proton Pump Inhibitor', icon: 'fa-pills' },
    { name: 'Zithromax (Azithromycin 500mg)', type: 'Antibiotic', icon: 'fa-pills' },
    { name: 'Bayer (Aspirin 75mg)', type: 'Pain Relief', icon: 'fa-pills' },
    { name: 'Advil/Motrin (Ibuprofen 400mg)', type: 'Pain Relief', icon: 'fa-pills' },
    { name: 'Voltaren (Diclofenac 50mg)', type: 'Pain Relief', icon: 'fa-pills' },
    { name: 'Zantac (Ranitidine 150mg)', type: 'Antacid', icon: 'fa-pills' },
    { name: 'Claritin (Loratadine 10mg)', type: 'Antihistamine', icon: 'fa-pills' }
];

// Get DOM elements
const searchInput = document.getElementById('medicineSearch');
const suggestionsContainer = document.getElementById('medicineSuggestions');

// Function to filter medicines based on search input
function filterMedicines(query) {
    const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);

    return medicines.filter(medicine => {
        const medicineName = medicine.name.toLowerCase();
        const medicineType = medicine.type.toLowerCase();

        // Check if all search terms match either the name or type
        return searchTerms.every(term =>
            medicineName.includes(term) || medicineType.includes(term)
        );
    });
}

// Function to create suggestion HTML
function createSuggestionHTML(medicine, query) {
    const name = medicine.name;
    const type = medicine.type;

    // Highlight matching text
    const highlightedName = highlightMatch(name, query);
    const highlightedType = highlightMatch(type, query);

    return `
        <div class="suggestion-item">
            <i class="fas ${medicine.icon}"></i>
            <div class="medicine-info">
                <div class="medicine-name">${highlightedName}</div>
                <div class="medicine-type">${highlightedType}</div>
            </div>
        </div>
    `;
}

// Function to highlight matching text
function highlightMatch(text, query) {
    if (!query) return text;

    const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
    let highlightedText = text;

    searchTerms.forEach(term => {
        const regex = new RegExp(`(${term})`, 'gi');
        highlightedText = highlightedText.replace(regex, '<mark>$1</mark>');
    });

    return highlightedText;
}

// Function to show suggestions
function showSuggestions(query) {
    if (!query.trim()) {
        suggestionsContainer.classList.remove('active');
        return;
    }

    const filteredMedicines = filterMedicines(query);

    if (filteredMedicines.length > 0) {
        suggestionsContainer.innerHTML = filteredMedicines
            .map(medicine => createSuggestionHTML(medicine, query))
            .join('');
        suggestionsContainer.classList.add('active');
    } else {
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
    }
}

// Add event listeners
searchInput.addEventListener('input', (e) => {
    showSuggestions(e.target.value);
});

searchInput.addEventListener('focus', () => {
    if (searchInput.value.trim()) {
        showSuggestions(searchInput.value);
    }
});

// Close suggestions when clicking outside
document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !suggestionsContainer.contains(e.target)) {
        suggestionsContainer.classList.remove('active');
    }
});

// Enhanced Student Mode System
let isStudentMode = sessionStorage.getItem('studentMode') === 'true';
const studentButton = document.querySelector('.action-btn.student');

// Create enhanced student badge with features
let studentBadge = document.createElement('div');
studentBadge.className = 'student-badge';
studentBadge.innerHTML = `
    <div class="badge-content">
        <i class="fas fa-graduation-cap"></i> 
        <span>Student Mode</span>
        <div class="badge-features">
            <span class="feature-tag">Chemical Structures</span>
            <span class="feature-tag">Study Notes</span>
            <span class="feature-tag">Quiz Mode</span>
        </div>
    </div>
`;
studentBadge.style.display = 'none';
document.body.appendChild(studentBadge);

// Create student mode panel
let studentPanel = document.createElement('div');
studentPanel.className = 'student-panel';
studentPanel.innerHTML = `
    <div class="panel-header">
        <h3><i class="fas fa-graduation-cap"></i> Student Learning Tools</h3>
        <button class="close-panel" onclick="toggleStudentPanel(false)">
            <i class="fas fa-times"></i>
        </button>
    </div>
    <div class="panel-content">
        <div class="learning-feature" onclick="toggleQuizMode()">
            <i class="fas fa-question-circle"></i>
            <div>
                <h4>Quiz Mode</h4>
                <p>Test your knowledge with interactive quizzes</p>
            </div>
        </div>
        <div class="learning-feature" onclick="toggleStudyNotes()">
            <i class="fas fa-sticky-note"></i>
            <div>
                <h4>Study Notes</h4>
                <p>Take and save notes while learning</p>
            </div>
        </div>
        <div class="learning-feature" onclick="toggleFlashcards()">
            <i class="fas fa-layer-group"></i>
            <div>
                <h4>Flashcards</h4>
                <p>Create flashcards for quick review</p>
            </div>
        </div>
        <div class="learning-feature" onclick="toggleProgressTracker()">
            <i class="fas fa-chart-line"></i>
            <div>
                <h4>Progress Tracker</h4>
                <p>Monitor your learning progress</p>
            </div>
        </div>
    </div>
`;
studentPanel.style.display = 'none';
document.body.appendChild(studentPanel);

// Student mode features state
let studentFeatures = {
    quizMode: false,
    studyNotes: JSON.parse(localStorage.getItem('studentNotes') || '{}'),
    flashcards: JSON.parse(localStorage.getItem('studentFlashcards') || '[]'),
    progress: JSON.parse(localStorage.getItem('studentProgress') || '{}')
};

// Initialize student button state
function updateStudentButtonState() {
    if (isStudentMode) {
        studentButton.classList.add('active');
        studentButton.innerHTML = '<i class="fas fa-graduation-cap"></i>';
        studentButton.title = 'Student Mode ON - Click for tools';
        studentBadge.style.display = 'flex';
        enableStudentFeatures();
    } else {
        studentButton.classList.remove('active');
        studentButton.innerHTML = '<i class="fas fa-graduation-cap"></i>';
        studentButton.title = 'Enable Student Mode';
        studentBadge.style.display = 'none';
        disableStudentFeatures();
    }
}

// Enable student mode features
function enableStudentFeatures() {
    document.body.classList.add('student-mode-active');
    addEducationalTooltips();
    enableStudentKeyboardShortcuts();
}

// Disable student mode features
function disableStudentFeatures() {
    document.body.classList.remove('student-mode-active');
    studentPanel.style.display = 'none';
    removeEducationalTooltips();
    disableStudentKeyboardShortcuts();
}

// Set initial state
updateStudentButtonState();

// Enhanced toggle student mode with panel
studentButton.addEventListener('click', (e) => {
    if (isStudentMode) {
        toggleStudentPanel();
    } else {
        isStudentMode = true;
        sessionStorage.setItem('studentMode', isStudentMode);
        updateStudentButtonState();
        showNotification('Student Mode activated! Enhanced learning features are now available.', 'success');
        setTimeout(() => toggleStudentPanel(true), 1000);
    }
});

// Add long press to disable student mode
let longPressTimer;
studentButton.addEventListener('mousedown', () => {
    if (isStudentMode) {
        longPressTimer = setTimeout(() => {
            isStudentMode = false;
            sessionStorage.setItem('studentMode', isStudentMode);
            updateStudentButtonState();
            showNotification('Student Mode deactivated.', 'info');
        }, 2000);
    }
});

studentButton.addEventListener('mouseup', () => clearTimeout(longPressTimer));
studentButton.addEventListener('mouseleave', () => clearTimeout(longPressTimer));

// Update suggestion click handler
suggestionsContainer.addEventListener('click', (e) => {
    const suggestionItem = e.target.closest('.suggestion-item');
    if (suggestionItem) {
        const medicineName = suggestionItem.querySelector('.medicine-name').textContent;
        searchInput.value = medicineName;
        suggestionsContainer.style.display = 'none';

        // Always pass student mode from session storage to maintain state
        const studentMode = sessionStorage.getItem('studentMode') === 'true';
        const studentParam = studentMode ? '&student=true' : '';
        window.location.href = `medicine-details.html?medicine=${encodeURIComponent(medicineName)}${studentParam}`;
    }
});

// ==================== NEW INTERACTIVE FEATURES ====================



// Event listeners for new features
document.addEventListener('DOMContentLoaded', function () {



    // Chat functionality
    const chatInput = document.getElementById('chatInput');
    const sendChatBtn = document.getElementById('sendChatBtn');

    if (chatInput && sendChatBtn) {
        chatInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });

        sendChatBtn.addEventListener('click', sendMessage);
    }

    // Severity slider
    const severityRange = document.getElementById('severityRange');
    const severityValue = document.getElementById('severityValue');

    if (severityRange && severityValue) {
        severityRange.addEventListener('input', function () {
            severityValue.textContent = this.value;
        });
    }

    // Reminder frequency change
    const reminderFrequency = document.getElementById('reminderFrequency');
    if (reminderFrequency) {
        reminderFrequency.addEventListener('change', function () {
            const customTimesGroup = document.getElementById('customTimesGroup');
            if (this.value === 'custom') {
                customTimesGroup.style.display = 'block';
            } else {
                customTimesGroup.style.display = 'none';
            }
        });
    }

    // Load active reminders
    loadActiveReminders();

    // Animate health stats on scroll
    animateStatsOnScroll();
});

// Modal Functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Feature Functions
function openSymptomChecker() {
    openModal('symptomCheckerModal');
}

function openPillReminder() {
    openModal('pillReminderModal');
}

function openInteractionChecker() {
    openModal('interactionCheckerModal');
}

// AI Chat Functions
function sendMessage() {
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');
    const message = chatInput.value.trim();

    if (!message) return;

    // Add user message
    const userMessage = createMessageElement(message, 'user');
    chatMessages.appendChild(userMessage);

    // Clear input
    chatInput.value = '';

    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Simulate AI response
    setTimeout(() => {
        const aiResponse = generateAIResponse(message);
        const aiMessage = createMessageElement(aiResponse, 'ai');
        chatMessages.appendChild(aiMessage);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 1000);
}

function createMessageElement(content, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;

    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.innerHTML = type === 'ai' ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>';

    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    messageContent.innerHTML = `<p>${content}</p>`;

    messageDiv.appendChild(avatar);
    messageDiv.appendChild(messageContent);

    return messageDiv;
}

function generateAIResponse(userMessage) {
    const responses = {
        'headache': 'For headaches, you might consider over-the-counter pain relievers like acetaminophen or ibuprofen. However, if headaches persist or are severe, please consult a healthcare professional.',
        'fever': 'For fever, acetaminophen or ibuprofen can help reduce temperature. Stay hydrated and rest. Seek medical attention if fever exceeds 103°F (39.4°C) or persists.',
        'cough': 'For cough, consider staying hydrated, using honey (for adults), or over-the-counter cough suppressants. If cough persists for more than 2 weeks or is accompanied by blood, see a doctor.',
        'pain': 'Pain management depends on the type and severity. Over-the-counter options include acetaminophen, ibuprofen, or aspirin. For chronic or severe pain, consult a healthcare provider.',
        'medicine': 'I can help you find information about medicines, check for interactions, or explain how medications work. What specific medicine are you asking about?',
        'interaction': 'Drug interactions can be serious. I recommend using our Drug Interaction Checker tool or consulting with a pharmacist or doctor before combining medications.',
        'side effects': 'Side effects vary by medication. Always read the medication label and consult your healthcare provider if you experience unexpected symptoms.',
        'dosage': 'Dosage depends on the specific medication, your age, weight, and medical condition. Always follow the instructions on the label or as prescribed by your doctor.'
    };

    const lowerMessage = userMessage.toLowerCase();

    for (const [key, response] of Object.entries(responses)) {
        if (lowerMessage.includes(key)) {
            return response;
        }
    }

    return "I understand you're asking about health-related topics. While I can provide general information, it's always best to consult with a healthcare professional for personalized medical advice. Is there a specific medicine or symptom you'd like to know more about?";
}

// Symptom Checker Functions
let currentStep = 1;
let symptomData = {};

function selectSymptom(symptom) {
    document.getElementById('mainSymptom').value = symptom;
    // Remove active class from all tags
    document.querySelectorAll('.symptom-tag').forEach(tag => {
        tag.classList.remove('selected');
    });
    // Add active class to selected tag
    event.target.classList.add('selected');
}

function nextStep(step) {
    // Validate current step
    if (!validateStep(currentStep)) return;

    // Hide current step
    document.getElementById(`step${currentStep}`).classList.remove('active');
    document.querySelector(`.step[data-step="${currentStep}"]`).classList.remove('active');
    document.querySelector(`.step[data-step="${currentStep}"]`).classList.add('completed');

    // Show next step
    currentStep = step;
    document.getElementById(`step${currentStep}`).classList.add('active');
    document.querySelector(`.step[data-step="${currentStep}"]`).classList.add('active');
}

function prevStep(step) {
    // Hide current step
    document.getElementById(`step${currentStep}`).classList.remove('active');
    document.querySelector(`.step[data-step="${currentStep}"]`).classList.remove('active');

    // Show previous step
    currentStep = step;
    document.getElementById(`step${currentStep}`).classList.add('active');
    document.querySelector(`.step[data-step="${currentStep}"]`).classList.add('active');
    document.querySelector(`.step[data-step="${currentStep}"]`).classList.remove('completed');
}

function validateStep(step) {
    switch (step) {
        case 1:
            const mainSymptom = document.getElementById('mainSymptom').value.trim();
            if (!mainSymptom) {
                showNotification('Please enter your main symptom', 'warning');
                return false;
            }
            symptomData.mainSymptom = mainSymptom;
            return true;
        case 2:
            const duration = document.querySelector('input[name="duration"]:checked');
            if (!duration) {
                showNotification('Please select how long you\'ve had this symptom', 'warning');
                return false;
            }
            symptomData.duration = duration.value;
            return true;
        case 3:
            symptomData.severity = document.getElementById('severityRange').value;
            return true;
        default:
            return true;
    }
}

function analyzeSymptoms() {
    symptomData.additionalSymptoms = document.getElementById('additionalSymptoms').value;

    // Hide step 4
    document.getElementById('step4').classList.remove('active');

    // Show results
    const resultsDiv = document.getElementById('symptomResults');
    const resultsContent = document.getElementById('resultsContent');

    // Generate analysis based on symptoms
    const analysis = generateSymptomAnalysis(symptomData);
    resultsContent.innerHTML = analysis;

    resultsDiv.style.display = 'block';
}

function generateSymptomAnalysis(data) {
    const severity = parseInt(data.severity);
    let urgency = 'low';
    let recommendations = [];

    if (severity >= 8) {
        urgency = 'high';
        recommendations.push('Seek immediate medical attention');
        recommendations.push('Consider visiting an emergency room');
    } else if (severity >= 5) {
        urgency = 'medium';
        recommendations.push('Schedule an appointment with your doctor');
        recommendations.push('Monitor symptoms closely');
    } else {
        urgency = 'low';
        recommendations.push('Try home remedies and rest');
        recommendations.push('See a doctor if symptoms worsen');
    }

    const urgencyColors = {
        'high': '#dc3545',
        'medium': '#ffc107',
        'low': '#28a745'
    };

    return `
        <div class="analysis-result">
            <div class="urgency-indicator" style="background: ${urgencyColors[urgency]}; color: white; padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
                <h4>Urgency Level: ${urgency.toUpperCase()}</h4>
                <p>Based on your symptoms: ${data.mainSymptom} (Severity: ${data.severity}/10)</p>
            </div>
            
            <div class="recommendations">
                <h4>Recommendations:</h4>
                <ul>
                    ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
                </ul>
            </div>
            
            <div class="disclaimer" style="background: #f8f9fa; padding: 1rem; border-radius: 8px; margin-top: 1rem; font-size: 0.9rem; color: #666;">
                <strong>Disclaimer:</strong> This analysis is for informational purposes only and should not replace professional medical advice. Always consult with a healthcare provider for proper diagnosis and treatment.
            </div>
        </div>
    `;
}

function restartSymptomChecker() {
    currentStep = 1;
    symptomData = {};

    // Reset all steps
    document.querySelectorAll('.symptom-step').forEach(step => {
        step.classList.remove('active');
    });
    document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('active', 'completed');
    });

    // Show first step
    document.getElementById('step1').classList.add('active');
    document.querySelector('.step[data-step="1"]').classList.add('active');

    // Hide results
    document.getElementById('symptomResults').style.display = 'none';

    // Clear form
    document.getElementById('mainSymptom').value = '';
    document.getElementById('additionalSymptoms').value = '';
    document.getElementById('severityRange').value = 5;
    document.getElementById('severityValue').textContent = '5';
    document.querySelectorAll('input[name="duration"]').forEach(input => {
        input.checked = false;
    });
}

// Pill Reminder Functions
function addTimeInput() {
    const timeInputs = document.getElementById('timeInputs');
    const newInput = document.createElement('input');
    newInput.type = 'time';
    newInput.className = 'time-input';
    timeInputs.appendChild(newInput);
}

function setReminder() {
    const reminderData = {
        id: Date.now(),
        medicineName: document.getElementById('reminderMedicineName').value,
        dosage: document.getElementById('reminderDosage').value,
        frequency: document.getElementById('reminderFrequency').value,
        startDate: document.getElementById('reminderStartDate').value,
        duration: document.getElementById('reminderDuration').value,
        notes: document.getElementById('reminderNotes').value,
        times: []
    };

    if (reminderData.frequency === 'custom') {
        const timeInputs = document.querySelectorAll('.time-input');
        reminderData.times = Array.from(timeInputs).map(input => input.value).filter(time => time);
    } else {
        // Set default times based on frequency
        const defaultTimes = {
            'once': ['08:00'],
            'twice': ['08:00', '20:00'],
            'thrice': ['08:00', '14:00', '20:00']
        };
        reminderData.times = defaultTimes[reminderData.frequency] || [];
    }

    // Validate
    if (!reminderData.medicineName || !reminderData.dosage || !reminderData.startDate || !reminderData.duration) {
        showNotification('Please fill in all required fields', 'warning');
        return;
    }

    // Save to localStorage
    let reminders = JSON.parse(localStorage.getItem('medicineReminders') || '[]');
    reminders.push(reminderData);
    localStorage.setItem('medicineReminders', JSON.stringify(reminders));

    showNotification('Reminder set successfully!', 'success');
    loadActiveReminders();

    // Clear form
    document.getElementById('reminderMedicineName').value = '';
    document.getElementById('reminderDosage').value = '';
    document.getElementById('reminderDuration').value = '';
    document.getElementById('reminderNotes').value = '';
}

function loadActiveReminders() {
    const remindersList = document.getElementById('remindersList');
    if (!remindersList) return;

    const reminders = JSON.parse(localStorage.getItem('medicineReminders') || '[]');

    if (reminders.length === 0) {
        remindersList.innerHTML = '<p style="color: #666; text-align: center;">No active reminders</p>';
        return;
    }

    remindersList.innerHTML = reminders.map(reminder => `
        <div class="reminder-item">
            <h4>${reminder.medicineName}</h4>
            <p><strong>Dosage:</strong> ${reminder.dosage}</p>
            <p><strong>Times:</strong> ${reminder.times.join(', ')}</p>
            <p><strong>Duration:</strong> ${reminder.duration} days</p>
            ${reminder.notes ? `<p><strong>Notes:</strong> ${reminder.notes}</p>` : ''}
            <div class="reminder-actions">
                <button class="btn-small btn-edit" onclick="editReminder(${reminder.id})">Edit</button>
                <button class="btn-small btn-delete" onclick="deleteReminder(${reminder.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

function deleteReminder(id) {
    let reminders = JSON.parse(localStorage.getItem('medicineReminders') || '[]');
    reminders = reminders.filter(reminder => reminder.id !== id);
    localStorage.setItem('medicineReminders', JSON.stringify(reminders));
    loadActiveReminders();
    showNotification('Reminder deleted', 'success');
}

// Drug Interaction Checker Functions
let selectedMedicines = [];

function addMedicineToCheck() {
    const input = document.getElementById('interactionMedicineInput');
    const medicineName = input.value.trim();

    if (!medicineName) return;

    if (selectedMedicines.includes(medicineName)) {
        showNotification('Medicine already added', 'warning');
        return;
    }

    selectedMedicines.push(medicineName);
    input.value = '';

    updateSelectedMedicinesDisplay();
    updateCheckButton();
}

function updateSelectedMedicinesDisplay() {
    const container = document.getElementById('selectedMedicines');

    if (selectedMedicines.length === 0) {
        container.innerHTML = '<p style="color: #666; text-align: center;">No medicines selected</p>';
        return;
    }

    container.innerHTML = selectedMedicines.map(medicine => `
        <div class="medicine-chip">
            <span>${medicine}</span>
            <button class="remove-chip" onclick="removeMedicineFromCheck('${medicine}')">&times;</button>
        </div>
    `).join('');
}

function removeMedicineFromCheck(medicineName) {
    selectedMedicines = selectedMedicines.filter(med => med !== medicineName);
    updateSelectedMedicinesDisplay();
    updateCheckButton();
}

function updateCheckButton() {
    const button = document.getElementById('checkInteractionsBtn');
    button.disabled = selectedMedicines.length < 2;
}

function checkInteractions() {
    if (selectedMedicines.length < 2) {
        showNotification('Please add at least 2 medicines', 'warning');
        return;
    }

    const resultsDiv = document.getElementById('interactionResults');
    const resultsContent = document.getElementById('interactionResultsContent');

    // Simulate interaction checking
    const interactions = generateInteractionResults(selectedMedicines);
    resultsContent.innerHTML = interactions;
    resultsDiv.style.display = 'block';
}

function generateInteractionResults(medicines) {
    // Simulate some common interactions
    const knownInteractions = [
        {
            medicines: ['aspirin', 'warfarin'],
            severity: 'high',
            description: 'Increased risk of bleeding when taken together'
        },
        {
            medicines: ['ibuprofen', 'aspirin'],
            severity: 'medium',
            description: 'May increase risk of stomach bleeding'
        },
        {
            medicines: ['acetaminophen', 'alcohol'],
            severity: 'high',
            description: 'Increased risk of liver damage'
        }
    ];

    let interactionResults = [];

    // Check for known interactions
    for (let i = 0; i < medicines.length; i++) {
        for (let j = i + 1; j < medicines.length; j++) {
            const med1 = medicines[i].toLowerCase();
            const med2 = medicines[j].toLowerCase();

            const interaction = knownInteractions.find(int =>
                (int.medicines.includes(med1) && int.medicines.includes(med2)) ||
                int.medicines.some(intMed => med1.includes(intMed) || med2.includes(intMed))
            );

            if (interaction) {
                interactionResults.push({
                    medicine1: medicines[i],
                    medicine2: medicines[j],
                    severity: interaction.severity,
                    description: interaction.description
                });
            }
        }
    }

    // Generate results HTML
    let resultsHTML = '';

    if (interactionResults.length === 0) {
        resultsHTML = `
            <div class="interaction-result safe">
                <div class="result-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h3>No Known Interactions</h3>
                <p>Based on our database, no significant interactions were found between the selected medicines.</p>
                <div class="disclaimer">
                    <p><strong>Note:</strong> This is not a complete list. Always consult your healthcare provider or pharmacist.</p>
                </div>
            </div>
        `;
    } else {
        resultsHTML = '<div class="interaction-results">';

        interactionResults.forEach(result => {
            const severityClass = result.severity === 'high' ? 'danger' : result.severity === 'medium' ? 'warning' : 'info';
            const severityIcon = result.severity === 'high' ? 'fa-exclamation-triangle' : result.severity === 'medium' ? 'fa-exclamation-circle' : 'fa-info-circle';

            resultsHTML += `
                <div class="interaction-result ${severityClass}">
                    <div class="result-icon">
                        <i class="fas ${severityIcon}"></i>
                    </div>
                    <div class="result-content">
                        <h4>${result.medicine1} + ${result.medicine2}</h4>
                        <p class="severity">Severity: <span class="${severityClass}">${result.severity.toUpperCase()}</span></p>
                        <p class="description">${result.description}</p>
                    </div>
                </div>
            `;
        });

        resultsHTML += `
            <div class="disclaimer">
                <p><strong>Important:</strong> These are potential interactions. Consult your healthcare provider before making any changes to your medications.</p>
            </div>
        </div>`;
    }

    return resultsHTML;
}

// Notification System
function showNotification(message, type = 'info', duration = 5000) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;

    const icon = getNotificationIcon(type);
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${icon}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;

    // Add to notification container
    let container = document.getElementById('notificationContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'notificationContainer';
        container.className = 'notification-container';
        document.body.appendChild(container);
    }

    container.appendChild(notification);

    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);

    // Auto remove
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, duration);
}

function getNotificationIcon(type) {
    const icons = {
        'success': 'fa-check-circle',
        'error': 'fa-exclamation-circle',
        'warning': 'fa-exclamation-triangle',
        'info': 'fa-info-circle'
    };
    return icons[type] || icons.info;
}

// Book Appointment Function
function bookAppointment() {
    showNotification('Redirecting to appointment booking...', 'info');
    // In a real app, this would redirect to appointment booking page
    setTimeout(() => {
        showNotification('Appointment booking feature coming soon!', 'warning');
    }, 1000);
}

// Animate health stats on scroll
function animateStatsOnScroll() {
    const stats = document.querySelectorAll('.stat-item');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                animateCounter(entry.target.querySelector('.stat-number'));
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(stat => observer.observe(stat));
}

function animateCounter(element) {
    const target = element.textContent;
    const number = parseInt(target.replace(/[^\d]/g, ''));
    const suffix = target.replace(/[\d,]/g, '');

    if (isNaN(number)) return;

    let current = 0;
    const increment = number / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= number) {
            current = number;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current).toLocaleString() + suffix;
    }, 30);
}

// Medicine selection function for search results
function selectMedicine(medicine) {
    // Store medicine data in session storage
    sessionStorage.setItem('currentMedicine', JSON.stringify(medicine));

    // Check if student mode is active
    const isStudentMode = sessionStorage.getItem('studentMode') === 'true';

    // Navigate to medicine details page
    const url = isStudentMode ? 'medicine-details.html?student=true' : 'medicine-details.html';
    window.location.href = url;
}

// Initialize page functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    // Check for hash in URL to open specific modals
    const hash = window.location.hash;
    if (hash === '#interaction-checker') {
        setTimeout(() => openInteractionChecker(), 500);
    } else if (hash === '#pill-reminder') {
        setTimeout(() => openPillReminder(), 500);
    }

    // Initialize other features
    initializeImageUpload();
    initializeModals();
});



function initializeImageUpload() {
    const uploadBtn = document.getElementById('uploadBtn');
    const imageUpload = document.getElementById('medicineImageUpload');

    if (uploadBtn && imageUpload) {
        uploadBtn.addEventListener('click', () => {
            imageUpload.click();
        });

        imageUpload.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                handleImageUpload(e.target.files[0]);
            }
        });
    }
}

function handleImageUpload(file) {
    if (!file.type.startsWith('image/')) {
        showNotification('Please select an image file', 'error');
        return;
    }

    showNotification('Image uploaded successfully! Processing...', 'success');

    // Simulate image processing
    setTimeout(() => {
        showNotification('Image recognition feature coming soon!', 'info');
    }, 2000);
}

function initializeModals() {
    // Close modals when clicking outside
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target.id);
        }
    });

    // Close modals with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.modal[style*="block"]');
            if (openModal) {
                closeModal(openModal.id);
            }
        }
    });
}

// Advanced Medicine Search with AI Integration
function performAdvancedSearch(query) {
    if (!query.trim()) return [];

    // Use AI search engine if available
    if (window.aiSearchEngine) {
        return window.aiSearchEngine.enhancedSearch(query, medicines);
    }

    // Fallback to basic search
    return medicines.filter(medicine =>
        medicine.name.toLowerCase().includes(query.toLowerCase())
    );
}

// Drug interactions database
const knownInteractions = {
    'warfarin': ['aspirin', 'ibuprofen'],
    'aspirin': ['warfarin', 'ibuprofen'],
    'ibuprofen': ['warfarin', 'aspirin', 'lisinopril'],
    'lisinopril': ['ibuprofen'],
    'metformin': ['alcohol'],
    'simvastatin': ['grapefruit']
};

// Function to check drug interactions
function checkDrugInteractions(medicines) {
    let results = [];
    let hasInteractions = false;

    for (let i = 0; i < medicines.length; i++) {
        for (let j = i + 1; j < medicines.length; j++) {
            const med1 = medicines[i].toLowerCase();
            const med2 = medicines[j].toLowerCase();

            if (knownInteractions[med1] && knownInteractions[med1].includes(med2)) {
                hasInteractions = true;
                results.push({
                    medicines: [medicines[i], medicines[j]],
                    severity: 'moderate',
                    description: `${medicines[i]} and ${medicines[j]} may interact. Consult your healthcare provider.`
                });
            }
        }
    }

    if (!hasInteractions) {
        results.push({
            medicines: medicines,
            severity: 'safe',
            description: 'No known major interactions found between the selected medicines.'
        });
    }

    return results.map(result => `
        <div class="interaction-alert ${result.severity}">
            <div>
                <h4>${result.medicines.join(' + ')}</h4>
                <p>${result.description}</p>
            </div>
        </div>
    `).join('');
}

// Animate stats on scroll
function animateStatsOnScroll() {
    const stats = document.querySelectorAll('.stat-number');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateNumber(entry.target);
                observer.unobserve(entry.target);
            }
        });
    });

    stats.forEach(stat => observer.observe(stat));
}

function animateNumber(element) {
    const target = element.textContent;
    const isNumber = /^\d+/.test(target);

    if (!isNumber) return;

    const finalNumber = parseInt(target.replace(/\D/g, ''));
    const suffix = target.replace(/[\d,]/g, '');
    let current = 0;
    const increment = finalNumber / 50;

    const timer = setInterval(() => {
        current += increment;
        if (current >= finalNumber) {
            current = finalNumber;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current).toLocaleString() + suffix;
    }, 30);
}

// Close modals when clicking outside
window.onclick = function (event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
}

// Appointment booking function
function bookAppointment() {
    showNotification('Appointment booking feature coming soon!', 'info');
    closeModal('symptomCheckerModal');
}


// Advanced Health Monitoring System
class HealthMonitor {
    constructor() {
        this.vitals = {};
        this.symptoms = [];
        this.medications = [];
        this.appointments = [];
        this.initializeMonitoring();
    }

    initializeMonitoring() {
        this.loadHealthData();
        this.setupHealthTracking();
        this.startVitalSigns();
    }

    loadHealthData() {
        this.vitals = JSON.parse(localStorage.getItem('healthVitals') || '{}');
        this.symptoms = JSON.parse(localStorage.getItem('healthSymptoms') || '[]');
        this.medications = JSON.parse(localStorage.getItem('currentMedications') || '[]');
        this.appointments = JSON.parse(localStorage.getItem('upcomingAppointments') || '[]');
    }

    saveHealthData() {
        localStorage.setItem('healthVitals', JSON.stringify(this.vitals));
        localStorage.setItem('healthSymptoms', JSON.stringify(this.symptoms));
        localStorage.setItem('currentMedications', JSON.stringify(this.medications));
        localStorage.setItem('upcomingAppointments', JSON.stringify(this.appointments));
    }

    recordVitals(type, value, unit) {
        const timestamp = new Date().toISOString();
        if (!this.vitals[type]) {
            this.vitals[type] = [];
        }

        this.vitals[type].push({
            value: parseFloat(value),
            unit,
            timestamp,
            id: Date.now()
        });

        // Keep only last 100 readings per vital type
        this.vitals[type] = this.vitals[type].slice(-100);
        this.saveHealthData();
        this.analyzeVitals(type, value);
    }

    analyzeVitals(type, value) {
        const alerts = [];
        const numValue = parseFloat(value);

        switch (type) {
            case 'bloodPressure':
                const [systolic, diastolic] = value.split('/').map(Number);
                if (systolic > 140 || diastolic > 90) {
                    alerts.push({
                        type: 'warning',
                        message: 'Blood pressure reading is elevated. Consider consulting your doctor.',
                        severity: 'high'
                    });
                }
                break;
            case 'heartRate':
                if (numValue > 100 || numValue < 60) {
                    alerts.push({
                        type: 'warning',
                        message: 'Heart rate is outside normal range. Monitor closely.',
                        severity: 'medium'
                    });
                }
                break;
            case 'temperature':
                if (numValue > 100.4) {
                    alerts.push({
                        type: 'warning',
                        message: 'Fever detected. Consider taking fever reducer and rest.',
                        severity: 'high'
                    });
                }
                break;
            case 'bloodSugar':
                if (numValue > 180 || numValue < 70) {
                    alerts.push({
                        type: 'warning',
                        message: 'Blood sugar level needs attention. Check with healthcare provider.',
                        severity: 'high'
                    });
                }
                break;
        }

        alerts.forEach(alert => {
            if (window.showNotification) {
                window.showNotification(alert.message, alert.type);
            }
        });
    }

    recordSymptom(symptom, severity, notes) {
        const symptomRecord = {
            id: Date.now(),
            symptom,
            severity: parseInt(severity),
            notes,
            timestamp: new Date().toISOString(),
            resolved: false
        };

        this.symptoms.unshift(symptomRecord);
        this.symptoms = this.symptoms.slice(0, 200); // Keep last 200 symptoms
        this.saveHealthData();

        // Suggest medicines based on symptoms
        this.suggestMedicinesForSymptom(symptom, severity);
    }

    suggestMedicinesForSymptom(symptom, severity) {
        const suggestions = {
            'headache': ['Acetaminophen', 'Ibuprofen', 'Aspirin'],
            'fever': ['Paracetamol', 'Ibuprofen', 'Aspirin'],
            'cough': ['Dextromethorphan', 'Guaifenesin'],
            'nausea': ['Ondansetron', 'Dramamine'],
            'pain': ['Ibuprofen', 'Acetaminophen', 'Naproxen'],
            'allergy': ['Cetirizine', 'Loratadine', 'Diphenhydramine']
        };

        const lowerSymptom = symptom.toLowerCase();
        for (const [key, medicines] of Object.entries(suggestions)) {
            if (lowerSymptom.includes(key)) {
                const suggestionHTML = `
                    <div class="symptom-suggestion">
                        <h4>Suggested medicines for ${symptom}:</h4>
                        <div class="medicine-suggestions">
                            ${medicines.map(med => `
                                <button class="suggestion-pill" onclick="searchMedicine('${med}')">
                                    ${med}
                                </button>
                            `).join('')}
                        </div>
                        <p><small>Always consult healthcare provider before taking any medication.</small></p>
                    </div>
                `;

                if (window.showNotification) {
                    window.showNotification(suggestionHTML, 'info', 10000);
                }
                break;
            }
        }
    }

    setupHealthTracking() {
        // Set up periodic health checks
        setInterval(() => {
            this.checkMedicationReminders();
            this.checkAppointmentReminders();
        }, 60000); // Check every minute
    }

    checkMedicationReminders() {
        const now = new Date();
        const reminders = JSON.parse(localStorage.getItem('medicineReminders') || '[]');

        reminders.forEach(reminder => {
            if (!reminder.active) return;

            reminder.times.forEach(time => {
                const [hours, minutes] = time.split(':').map(Number);
                const reminderTime = new Date();
                reminderTime.setHours(hours, minutes, 0, 0);

                const timeDiff = Math.abs(now.getTime() - reminderTime.getTime());

                // If within 1 minute of reminder time
                if (timeDiff <= 60000) {
                    this.showMedicationReminder(reminder);
                }
            });
        });
    }

    showMedicationReminder(reminder) {
        const reminderHTML = `
            <div class="medication-reminder">
                <h4><i class="fas fa-pills"></i> Time for ${reminder.medicineName}</h4>
                <p>Dosage: ${reminder.dosage}</p>
                <div class="reminder-actions">
                    <button onclick="markMedicationTaken('${reminder.id}')" class="btn-taken">
                        <i class="fas fa-check"></i> Taken
                    </button>
                    <button onclick="snoozeMedicationReminder('${reminder.id}')" class="btn-snooze">
                        <i class="fas fa-clock"></i> Snooze 15min
                    </button>
                </div>
            </div>
        `;

        if (window.showNotification) {
            window.showNotification(reminderHTML, 'info', 30000);
        }

        // Play notification sound if available
        this.playNotificationSound();
    }

    playNotificationSound() {
        try {
            const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
            audio.volume = 0.3;
            audio.play().catch(() => {
                // Ignore audio play errors
            });
        } catch (error) {
            // Ignore audio errors
        }
    }

    generateHealthSummary() {
        const summary = {
            vitals: this.getLatestVitals(),
            recentSymptoms: this.symptoms.slice(0, 5),
            activeMedications: this.medications.filter(med => med.active),
            upcomingAppointments: this.appointments.filter(apt =>
                new Date(apt.date) > new Date()
            ).slice(0, 3),
            healthScore: this.calculateHealthScore()
        };

        return summary;
    }

    getLatestVitals() {
        const latest = {};
        Object.entries(this.vitals).forEach(([type, readings]) => {
            if (readings.length > 0) {
                latest[type] = readings[readings.length - 1];
            }
        });
        return latest;
    }

    calculateHealthScore() {
        let score = 100;
        const latest = this.getLatestVitals();

        // Deduct points for abnormal vitals
        if (latest.bloodPressure) {
            const [systolic] = latest.bloodPressure.value.toString().split('/').map(Number);
            if (systolic > 140) score -= 10;
        }

        if (latest.heartRate) {
            const hr = latest.heartRate.value;
            if (hr > 100 || hr < 60) score -= 5;
        }

        if (latest.temperature) {
            if (latest.temperature.value > 100.4) score -= 15;
        }

        // Deduct points for recent severe symptoms
        const severeSymptoms = this.symptoms.filter(s =>
            s.severity >= 7 &&
            new Date(s.timestamp) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        );
        score -= severeSymptoms.length * 5;

        return Math.max(0, Math.min(100, score));
    }
}

// Enhanced Emergency System
class EmergencySystem {
    constructor() {
        this.emergencyContacts = this.loadEmergencyContacts();
        this.medicalInfo = this.loadMedicalInfo();
        this.setupEmergencyFeatures();
    }

    loadEmergencyContacts() {
        return JSON.parse(localStorage.getItem('emergencyContacts') || '[]');
    }

    loadMedicalInfo() {
        return JSON.parse(localStorage.getItem('medicalInfo') || '{}');
    }

    setupEmergencyFeatures() {
        // Setup emergency button
        this.createEmergencyButton();

        // Setup shake detection for emergency
        if (window.DeviceMotionEvent) {
            this.setupShakeDetection();
        }
    }

    createEmergencyButton() {
        const emergencyBtn = document.createElement('button');
        emergencyBtn.id = 'emergencyButton';
        emergencyBtn.className = 'emergency-button';
        emergencyBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
        emergencyBtn.title = 'Emergency - Hold for 3 seconds';

        let holdTimer;

        emergencyBtn.addEventListener('mousedown', () => {
            holdTimer = setTimeout(() => {
                this.triggerEmergency();
            }, 3000);
        });

        emergencyBtn.addEventListener('mouseup', () => {
            clearTimeout(holdTimer);
        });

        emergencyBtn.addEventListener('mouseleave', () => {
            clearTimeout(holdTimer);
        });

        document.body.appendChild(emergencyBtn);
    }

    setupShakeDetection() {
        let lastTime = 0;
        let shakeCount = 0;

        window.addEventListener('devicemotion', (event) => {
            const acceleration = event.accelerationIncludingGravity;
            const currentTime = new Date().getTime();

            if ((currentTime - lastTime) > 100) {
                const deltaTime = currentTime - lastTime;
                lastTime = currentTime;

                const speed = Math.abs(acceleration.x + acceleration.y + acceleration.z - this.lastX - this.lastY - this.lastZ) / deltaTime * 10000;

                if (speed > 3000) {
                    shakeCount++;
                    if (shakeCount >= 3) {
                        this.triggerEmergency();
                        shakeCount = 0;
                    }

                    setTimeout(() => {
                        shakeCount = Math.max(0, shakeCount - 1);
                    }, 3000);
                }

                this.lastX = acceleration.x;
                this.lastY = acceleration.y;
                this.lastZ = acceleration.z;
            }
        });
    }

    triggerEmergency() {
        const emergencyModal = this.createEmergencyModal();
        document.body.appendChild(emergencyModal);

        // Start countdown
        this.startEmergencyCountdown();

        // Get location if available
        this.getCurrentLocation();
    }

    createEmergencyModal() {
        const modal = document.createElement('div');
        modal.className = 'emergency-modal';
        modal.innerHTML = `
            <div class="emergency-modal-content">
                <div class="emergency-header">
                    <h2><i class="fas fa-exclamation-triangle"></i> EMERGENCY ACTIVATED</h2>
                    <div class="countdown" id="emergencyCountdown">10</div>
                </div>
                <div class="emergency-body">
                    <p>Emergency services will be contacted in <span id="countdownText">10</span> seconds</p>
                    <div class="emergency-actions">
                        <button class="btn-cancel" onclick="this.closest('.emergency-modal').remove()">
                            <i class="fas fa-times"></i> Cancel
                        </button>
                        <button class="btn-call-now" onclick="window.emergencySystem.callEmergencyNow()">
                            <i class="fas fa-phone"></i> Call Now
                        </button>
                    </div>
                    <div class="medical-info">
                        <h4>Your Medical Information:</h4>
                        <div id="emergencyMedicalInfo">${this.formatMedicalInfo()}</div>
                    </div>
                </div>
            </div>
        `;
        return modal;
    }

    startEmergencyCountdown() {
        let countdown = 10;
        const countdownElement = document.getElementById('emergencyCountdown');
        const countdownText = document.getElementById('countdownText');

        const timer = setInterval(() => {
            countdown--;
            if (countdownElement) countdownElement.textContent = countdown;
            if (countdownText) countdownText.textContent = countdown;

            if (countdown <= 0) {
                clearInterval(timer);
                this.callEmergencyNow();
            }
        }, 1000);
    }

    callEmergencyNow() {
        // In a real app, this would contact emergency services
        // For demo, we'll show the emergency information

        const emergencyInfo = {
            timestamp: new Date().toISOString(),
            location: this.currentLocation || 'Location unavailable',
            medicalInfo: this.medicalInfo,
            emergencyContacts: this.emergencyContacts,
            currentMedications: JSON.parse(localStorage.getItem('currentMedications') || '[]'),
            allergies: this.medicalInfo.allergies || [],
            medicalConditions: this.medicalInfo.conditions || []
        };

        // Close emergency modal
        const modal = document.querySelector('.emergency-modal');
        if (modal) modal.remove();

        // Show emergency info
        this.showEmergencyInfo(emergencyInfo);

        // Try to call emergency number
        if (confirm('Call emergency services (108)?')) {
            window.location.href = 'tel:108';
        }
    }

    getCurrentLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.currentLocation = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        accuracy: position.coords.accuracy
                    };
                },
                (error) => {
                    console.error('Location error:', error);
                    this.currentLocation = 'Location access denied';
                }
            );
        }
    }

    formatMedicalInfo() {
        if (!this.medicalInfo || Object.keys(this.medicalInfo).length === 0) {
            return '<p>No medical information on file. <a href="#" onclick="openMedicalInfoForm()">Add medical info</a></p>';
        }

        let html = '';
        if (this.medicalInfo.bloodType) html += `<p><strong>Blood Type:</strong> ${this.medicalInfo.bloodType}</p>`;
        if (this.medicalInfo.allergies) html += `<p><strong>Allergies:</strong> ${this.medicalInfo.allergies.join(', ')}</p>`;
        if (this.medicalInfo.conditions) html += `<p><strong>Medical Conditions:</strong> ${this.medicalInfo.conditions.join(', ')}</p>`;

        return html;
    }

    showEmergencyInfo(info) {
        const infoModal = document.createElement('div');
        infoModal.className = 'emergency-info-modal';
        infoModal.innerHTML = `
            <div class="emergency-info-content">
                <h2>Emergency Information Prepared</h2>
                <div class="info-section">
                    <h3>Location</h3>
                    <p>${typeof info.location === 'object' ?
                `Lat: ${info.location.latitude}, Lng: ${info.location.longitude}` :
                info.location}</p>
                </div>
                <div class="info-section">
                    <h3>Medical Information</h3>
                    ${this.formatMedicalInfo()}
                </div>
                <div class="info-section">
                    <h3>Current Medications</h3>
                    ${info.currentMedications.length > 0 ?
                info.currentMedications.map(med => `<p>• ${med.name} - ${med.dosage}</p>`).join('') :
                '<p>No current medications</p>'}
                </div>
                <button onclick="this.closest('.emergency-info-modal').remove()" class="btn-close">
                    Close
                </button>
            </div>
        `;

        document.body.appendChild(infoModal);
    }
}

// Global function implementations
function searchMedicine(medicineName) {
    const searchInput = document.getElementById('medicineSearch');
    if (searchInput) {
        searchInput.value = medicineName;
        searchInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
}

function markMedicationTaken(reminderId) {
    if (window.pillReminder) {
        window.pillReminder.markAsTaken(reminderId);
    }

    // Record in health monitor
    if (window.healthMonitor) {
        const reminder = JSON.parse(localStorage.getItem('medicineReminders') || '[]')
            .find(r => r.id == reminderId);
        if (reminder) {
            document.dispatchEvent(new CustomEvent('medicationTaken', {
                detail: {
                    medicine: reminder.medicineName,
                    onTime: true,
                    timestamp: new Date().toISOString()
                }
            }));
        }
    }
}

function snoozeMedicationReminder(reminderId) {
    if (window.pillReminder) {
        window.pillReminder.snoozeReminder(reminderId, 15);
    }
    if (window.showNotification) {
        window.showNotification('Reminder snoozed for 15 minutes', 'info');
    }
}

function openMedicalInfoForm() {
    // This would open a form to collect medical information
    if (window.showNotification) {
        window.showNotification('Medical information form coming soon!', 'info');
    }
}

// Initialize enhanced systems on page load
document.addEventListener('DOMContentLoaded', function () {
    // Initialize health monitor
    if (!window.healthMonitor) {
        window.healthMonitor = new HealthMonitor();
    }

    // Initialize emergency system
    if (!window.emergencySystem) {
        window.emergencySystem = new EmergencySystem();
    }

    console.log('Enhanced health systems initialized');
});

// Export additional functions for global use
window.searchMedicine = searchMedicine;
window.markMedicationTaken = markMedicationTaken;
window.snoozeMedicationReminder = snoozeMedicationReminder;
window.openMedicalInfoForm = openMedicalInfoForm;
window.HealthMonitor = HealthMonitor;
window.EmergencySystem = EmergencySystem;

// Error handling and debugging utilities
window.addEventListener('error', function (event) {
    console.error('JavaScript Error:', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error
    });

    // Show user-friendly error message
    if (window.showNotification) {
        window.showNotification('An error occurred. Please refresh the page.', 'error');
    }
});

// Unhandled promise rejection handler
window.addEventListener('unhandledrejection', function (event) {
    console.error('Unhandled Promise Rejection:', event.reason);

    if (window.showNotification) {
        window.showNotification('A network or processing error occurred.', 'warning');
    }
});

// Debug function to check if all required elements exist
function debugCheckElements() {
    const requiredElements = [
        'medicineSearch',
        'suggestionsContainer',
        'menuToggle',
        'mainNav',
        'sidebarOverlay'
    ];

    const missingElements = [];

    requiredElements.forEach(id => {
        if (!document.getElementById(id)) {
            missingElements.push(id);
        }
    });

    if (missingElements.length > 0) {
        console.warn('Missing required elements:', missingElements);
    } else {
        console.log('✓ All required elements found');
    }

    return missingElements;
}

// Safe function caller - prevents errors from undefined functions
function safeCall(functionName, ...args) {
    try {
        if (typeof window[functionName] === 'function') {
            return window[functionName](...args);
        } else {
            console.warn(`Function ${functionName} is not defined`);
            return null;
        }
    } catch (error) {
        console.error(`Error calling ${functionName}:`, error);
        return null;
    }
}

// Initialize debug mode if URL contains debug parameter
if (window.location.search.includes('debug=true')) {
    console.log('Debug mode enabled');

    // Run element check after DOM is loaded
    document.addEventListener('DOMContentLoaded', function () {
        setTimeout(debugCheckElements, 1000);
    });

    // Add debug info to page
    const debugInfo = document.createElement('div');
    debugInfo.id = 'debug-info';
    debugInfo.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 10px;
        border-radius: 5px;
        font-family: monospace;
        font-size: 12px;
        z-index: 10000;
        max-width: 300px;
    `;
    debugInfo.innerHTML = `
        <strong>Debug Mode</strong><br>
        <span id="debug-status">Initializing...</span>
    `;
    document.body.appendChild(debugInfo);

    // Update debug status
    document.addEventListener('DOMContentLoaded', function () {
        const statusElement = document.getElementById('debug-status');
        if (statusElement) {
            statusElement.innerHTML = `
                DOM Loaded: ✓<br>
                Script Errors: ${window.scriptErrors || 0}<br>
                Missing Elements: ${debugCheckElements().length}
            `;
        }
    });
}

console.log('MediView application loaded successfully!');

// Student Mode Functions
function toggleStudentPanel(show = null) {
    if (show === null) {
        studentPanel.style.display = studentPanel.style.display === 'none' ? 'block' : 'none';
    } else {
        studentPanel.style.display = show ? 'block' : 'none';
    }
}

function toggleQuizMode() {
    studentFeatures.quizMode = !studentFeatures.quizMode;
    if (studentFeatures.quizMode) {
        showNotification('Quiz Mode activated! Medicine details will include quiz questions.', 'success');
    } else {
        showNotification('Quiz Mode deactivated.', 'info');
    }
}

function toggleStudyNotes() {
    const notesPanel = document.getElementById('studyNotesPanel');
    if (notesPanel) {
        notesPanel.style.display = notesPanel.style.display === 'none' ? 'block' : 'none';
    } else {
        createStudyNotesPanel();
    }
}

function toggleFlashcards() {
    showNotification('Flashcard feature coming soon! Create flashcards from medicine details.', 'info');
}

function toggleProgressTracker() {
    showNotification('Progress tracking activated! Your learning progress is being monitored.', 'success');
}

function createStudyNotesPanel() {
    const notesPanel = document.createElement('div');
    notesPanel.id = 'studyNotesPanel';
    notesPanel.className = 'study-notes-panel';
    notesPanel.innerHTML = `
        <div class="notes-header">
            <h3><i class="fas fa-sticky-note"></i> Study Notes</h3>
            <button onclick="document.getElementById('studyNotesPanel').style.display='none'">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="notes-content">
            <textarea id="studyNotesText" placeholder="Take notes while studying medicines..."></textarea>
            <div class="notes-actions">
                <button onclick="saveStudyNotes()" class="save-btn">
                    <i class="fas fa-save"></i> Save Notes
                </button>
                <button onclick="clearStudyNotes()" class="clear-btn">
                    <i class="fas fa-trash"></i> Clear
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(notesPanel);
}

function saveStudyNotes() {
    const notesText = document.getElementById('studyNotesText').value;
    const currentMedicine = sessionStorage.getItem('currentMedicine');
    
    if (currentMedicine) {
        const medicine = JSON.parse(currentMedicine);
        studentFeatures.studyNotes[medicine.name] = notesText;
        localStorage.setItem('studentNotes', JSON.stringify(studentFeatures.studyNotes));
        showNotification('Notes saved successfully!', 'success');
    }
}

function clearStudyNotes() {
    document.getElementById('studyNotesText').value = '';
}

function addEducationalTooltips() {
    const medicines = document.querySelectorAll('.suggestion-item');
    medicines.forEach(item => {
        if (!item.querySelector('.edu-tooltip')) {
            const tooltip = document.createElement('div');
            tooltip.className = 'edu-tooltip';
            tooltip.innerHTML = '<i class="fas fa-info-circle"></i> Click to learn more';
            item.appendChild(tooltip);
        }
    });
}

function removeEducationalTooltips() {
    document.querySelectorAll('.edu-tooltip').forEach(tooltip => tooltip.remove());
}

function enableStudentKeyboardShortcuts() {
    document.addEventListener('keydown', studentKeyboardHandler);
}

function disableStudentKeyboardShortcuts() {
    document.removeEventListener('keydown', studentKeyboardHandler);
}

function studentKeyboardHandler(e) {
    if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
            case 'q':
                e.preventDefault();
                toggleQuizMode();
                break;
            case 'n':
                e.preventDefault();
                toggleStudyNotes();
                break;
            case 'p':
                e.preventDefault();
                toggleStudentPanel();
                break;
        }
    }
}

// Enhanced Header Interactivity
document.addEventListener('DOMContentLoaded', () => {
    const logoContainer = document.getElementById('logoContainer');
    const menuBtn = document.getElementById('menuToggle');
    const letters = document.querySelectorAll('.letter');
    
    // Logo container click effect
    if (logoContainer) {
        logoContainer.addEventListener('click', () => {
            // Add a special click animation
            logoContainer.style.transform = 'scale(0.95)';
            setTimeout(() => {
                logoContainer.style.transform = '';
            }, 150);
            
            // Animate letters on logo click
            letters.forEach((letter, index) => {
                setTimeout(() => {
                    letter.style.transform = 'translateY(-5px) scale(1.1)';
                    letter.style.color = 'var(--primary-color)';
                    setTimeout(() => {
                        letter.style.transform = '';
                        letter.style.color = '';
                    }, 300);
                }, index * 50);
            });
        });
    }
    
    // Menu button ripple effect
    if (menuBtn) {
        menuBtn.addEventListener('click', (e) => {
            const ripple = menuBtn.querySelector('.btn-ripple');
            if (ripple) {
                ripple.style.width = '0';
                ripple.style.height = '0';
                ripple.style.opacity = '0.5';
                
                setTimeout(() => {
                    ripple.style.width = '100px';
                    ripple.style.height = '100px';
                    ripple.style.opacity = '0';
                }, 10);
            }
        });
    }
    
    // Header scroll effect
    let lastScrollY = window.scrollY;
    const header = document.querySelector('.interactive-header');
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (header) {
            if (currentScrollY > 50) {
                header.style.background = 'rgba(255, 255, 255, 0.98)';
                header.style.boxShadow = '0 6px 25px rgba(0, 0, 0, 0.12)';
            } else {
                header.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(248, 250, 252, 0.98))';
                header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
            }
            
            // Hide/show header on scroll
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
        }
        
        lastScrollY = currentScrollY;
    });
    
    // Parallax effect for floating particles
    window.addEventListener('mousemove', (e) => {
        const particles = document.querySelectorAll('.floating-particle');
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        particles.forEach((particle, index) => {
            const speed = (index + 1) * 0.5;
            const x = (mouseX - 0.5) * speed * 10;
            const y = (mouseY - 0.5) * speed * 10;
            
            particle.style.transform = `translate(${x}px, ${y}px)`;
        });
    });
    
    // Health status indicator click
    const healthStatus = document.querySelector('.health-status-indicator');
    if (healthStatus) {
        healthStatus.addEventListener('click', () => {
            // Show a tooltip or notification
            const tooltip = document.createElement('div');
            tooltip.textContent = 'Our medical team is available 24/7 to assist you!';
            tooltip.style.cssText = `
                position: absolute;
                top: 100%;
                right: 0;
                background: #2ecc71;
                color: white;
                padding: 0.5rem 1rem;
                border-radius: 8px;
                font-size: 0.8rem;
                white-space: nowrap;
                z-index: 1000;
                animation: fadeIn 0.3s ease;
            `;
            
            healthStatus.style.position = 'relative';
            healthStatus.appendChild(tooltip);
            
            setTimeout(() => {
                if (tooltip.parentNode) {
                    tooltip.remove();
                }
            }, 3000);
        });
    }
});

/
/ Dark Mode Toggle Functionality
document.addEventListener('DOMContentLoaded', () => {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;
    const icon = darkModeToggle.querySelector('i');

    // Check for saved dark mode preference
    const isDarkMode = localStorage.getItem('darkMode') === 'enabled';
    
    if (isDarkMode) {
        body.classList.add('dark-mode');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    }

    // Toggle dark mode
    darkModeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        
        // Update icon
        if (body.classList.contains('dark-mode')) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
            localStorage.setItem('darkMode', 'enabled');
            
            // Add transition effect
            body.style.transition = 'background-color 0.5s ease, color 0.5s ease';
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
            localStorage.setItem('darkMode', 'disabled');
        }
    });

    // Create shooting stars periodically in dark mode
    function createShootingStar() {
        if (!body.classList.contains('dark-mode')) return;
        
        const star = document.createElement('div');
        star.className = 'shooting-star';
        star.style.cssText = `
            position: fixed;
            top: ${Math.random() * 50}%;
            right: -100px;
            width: 2px;
            height: 100px;
            background: linear-gradient(to bottom, transparent, white, transparent);
            transform: rotate(-45deg);
            pointer-events: none;
            z-index: 1;
            animation: shoot 3s linear;
        `;
        
        document.body.appendChild(star);
        
        setTimeout(() => {
            star.remove();
        }, 3000);
    }

    // Add shooting star animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shoot {
            0% {
                transform: translate(0, 0) rotate(-45deg);
                opacity: 0;
            }
            10% {
                opacity: 1;
            }
            90% {
                opacity: 1;
            }
            100% {
                transform: translate(-1000px, 1000px) rotate(-45deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // Create shooting stars every 5-10 seconds in dark mode
    setInterval(() => {
        if (body.classList.contains('dark-mode')) {
            createShootingStar();
        }
    }, Math.random() * 5000 + 5000);
});
