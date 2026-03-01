// Advanced Features for MediView Application

// Medicine Recommendation Engine
class MedicineRecommendationEngine {
    constructor() {
        this.userPreferences = this.loadUserPreferences();
        this.medicineHistory = this.loadMedicineHistory();
    }

    loadUserPreferences() {
        return JSON.parse(localStorage.getItem('userPreferences') || '{}');
    }

    loadMedicineHistory() {
        return JSON.parse(localStorage.getItem('medicineHistory') || '[]');
    }

    saveUserPreferences(preferences) {
        localStorage.setItem('userPreferences', JSON.stringify(preferences));
        this.userPreferences = preferences;
    }

    addToHistory(medicine) {
        this.medicineHistory.unshift(medicine);
        // Keep only last 50 items
        this.medicineHistory = this.medicineHistory.slice(0, 50);
        localStorage.setItem('medicineHistory', JSON.stringify(this.medicineHistory));
    }

    getRecommendations(currentMedicine) {
        const recommendations = [];
        
        // Based on user history
        const historyRecommendations = this.getHistoryBasedRecommendations(currentMedicine);
        recommendations.push(...historyRecommendations);
        
        // Based on similar conditions
        const conditionRecommendations = this.getConditionBasedRecommendations(currentMedicine);
        recommendations.push(...conditionRecommendations);
        
        // Based on user preferences
        const preferenceRecommendations = this.getPreferenceBasedRecommendations(currentMedicine);
        recommendations.push(...preferenceRecommendations);
        
        // Remove duplicates and current medicine
        const uniqueRecommendations = recommendations.filter((rec, index, self) => 
            index === self.findIndex(r => r.name === rec.name) && 
            rec.name !== currentMedicine.name
        );
        
        return uniqueRecommendations.slice(0, 6);
    }

    getHistoryBasedRecommendations(currentMedicine) {
        // Find medicines used for similar conditions
        return this.medicineHistory.filter(med => 
            med.category === currentMedicine.category ||
            med.uses?.toLowerCase().includes(currentMedicine.uses?.toLowerCase().split(' ')[0] || '')
        );
    }

    getConditionBasedRecommendations(currentMedicine) {
        // This would typically come from a medical database
        const conditionMap = {
            'pain': ['Ibuprofen', 'Acetaminophen', 'Naproxen'],
            'fever': ['Paracetamol', 'Aspirin', 'Ibuprofen'],
            'infection': ['Amoxicillin', 'Azithromycin', 'Cephalexin'],
            'allergy': ['Cetirizine', 'Loratadine', 'Diphenhydramine']
        };
        
        const condition = this.extractCondition(currentMedicine.uses || '');
        return (conditionMap[condition] || []).map(name => ({ name, category: condition }));
    }

    getPreferenceBasedRecommendations(currentMedicine) {
        const preferences = this.userPreferences;
        const recommendations = [];
        
        if (preferences.preferGeneric && !currentMedicine.generic) {
            // Find generic alternatives
            recommendations.push({
                name: `Generic ${currentMedicine.name.split('(')[0].trim()}`,
                category: currentMedicine.category,
                generic: true,
                reason: 'Generic alternative'
            });
        }
        
        return recommendations;
    }

    extractCondition(uses) {
        const conditions = ['pain', 'fever', 'infection', 'allergy'];
        return conditions.find(condition => 
            uses.toLowerCase().includes(condition)
        ) || 'general';
    }
}

// Smart Dosage Calculator
class SmartDosageCalculator {
    constructor() {
        this.dosageRules = this.loadDosageRules();
    }

    loadDosageRules() {
        return {
            'acetaminophen': {
                adult: { min: 325, max: 1000, interval: 4, maxDaily: 4000 },
                child: { weightBased: 10, interval: 4, maxDaily: 75 },
                elderly: { reduction: 0.75 }
            },
            'ibuprofen': {
                adult: { min: 200, max: 800, interval: 6, maxDaily: 3200 },
                child: { weightBased: 5, interval: 6, maxDaily: 40 },
                elderly: { reduction: 0.8 }
            },
            'amoxicillin': {
                adult: { min: 250, max: 500, interval: 8, maxDaily: 1500 },
                child: { weightBased: 20, interval: 8, maxDaily: 90 },
                elderly: { reduction: 0.9 }
            }
        };
    }

    calculateDosage(medicine, patient) {
        const medicineName = medicine.name.toLowerCase();
        const rule = this.findDosageRule(medicineName);
        
        if (!rule) {
            return this.getGenericDosage(patient);
        }

        const { weight, age, condition, kidneyFunction, liverFunction } = patient;
        let dosage = {};

        if (age < 18) {
            // Pediatric dosing
            dosage = this.calculatePediatricDosage(rule, weight, age);
        } else if (age > 65) {
            // Geriatric dosing
            dosage = this.calculateGeriatricDosage(rule, weight, age);
        } else {
            // Adult dosing
            dosage = this.calculateAdultDosage(rule, weight, condition);
        }

        // Adjust for organ function
        dosage = this.adjustForOrganFunction(dosage, kidneyFunction, liverFunction);

        return {
            ...dosage,
            warnings: this.generateWarnings(medicine, patient),
            contraindications: this.checkContraindications(medicine, patient)
        };
    }

    findDosageRule(medicineName) {
        for (const [key, rule] of Object.entries(this.dosageRules)) {
            if (medicineName.includes(key)) {
                return rule;
            }
        }
        return null;
    }

    calculatePediatricDosage(rule, weight, age) {
        if (!rule.child) return this.getGenericDosage({ weight, age });
        
        const dosePerKg = rule.child.weightBased;
        const singleDose = Math.round(weight * dosePerKg);
        const maxDailyDose = Math.round(weight * rule.child.maxDaily);
        const frequency = 24 / rule.child.interval;
        
        return {
            singleDose: `${singleDose}mg`,
            frequency: `${frequency} times daily`,
            maxDaily: `${maxDailyDose}mg`,
            interval: `every ${rule.child.interval} hours`
        };
    }

    calculateAdultDosage(rule, weight, condition) {
        let baseDose = rule.adult.min;
        
        // Adjust based on condition severity
        if (condition === 'severe') {
            baseDose = rule.adult.max;
        } else if (condition === 'moderate') {
            baseDose = Math.round((rule.adult.min + rule.adult.max) / 2);
        }
        
        const frequency = 24 / rule.adult.interval;
        
        return {
            singleDose: `${baseDose}mg`,
            frequency: `${frequency} times daily`,
            maxDaily: `${rule.adult.maxDaily}mg`,
            interval: `every ${rule.adult.interval} hours`
        };
    }

    calculateGeriatricDosage(rule, weight, age) {
        const adultDosage = this.calculateAdultDosage(rule, weight, 'mild');
        const reduction = rule.elderly?.reduction || 0.75;
        
        const adjustedDose = Math.round(
            parseInt(adultDosage.singleDose) * reduction
        );
        
        return {
            ...adultDosage,
            singleDose: `${adjustedDose}mg`,
            note: 'Reduced dose for elderly patient'
        };
    }

    adjustForOrganFunction(dosage, kidneyFunction, liverFunction) {
        let adjustedDosage = { ...dosage };
        
        if (kidneyFunction === 'impaired') {
            const currentDose = parseInt(adjustedDosage.singleDose);
            adjustedDosage.singleDose = `${Math.round(currentDose * 0.5)}mg`;
            adjustedDosage.note = (adjustedDosage.note || '') + ' Reduced for kidney impairment.';
        }
        
        if (liverFunction === 'impaired') {
            const currentDose = parseInt(adjustedDosage.singleDose);
            adjustedDosage.singleDose = `${Math.round(currentDose * 0.6)}mg`;
            adjustedDosage.note = (adjustedDosage.note || '') + ' Reduced for liver impairment.';
        }
        
        return adjustedDosage;
    }

    generateWarnings(medicine, patient) {
        const warnings = [];
        
        if (patient.age > 65) {
            warnings.push('Elderly patients may be more sensitive to side effects');
        }
        
        if (patient.weight < 50) {
            warnings.push('Lower body weight may require dose adjustment');
        }
        
        if (patient.allergies && patient.allergies.length > 0) {
            warnings.push('Check for drug allergies before administration');
        }
        
        return warnings;
    }

    checkContraindications(medicine, patient) {
        const contraindications = [];
        
        // This would be expanded with a comprehensive database
        if (medicine.name.toLowerCase().includes('aspirin') && patient.age < 16) {
            contraindications.push('Aspirin not recommended for children under 16');
        }
        
        return contraindications;
    }

    getGenericDosage(patient) {
        return {
            singleDose: 'As prescribed',
            frequency: 'As directed by physician',
            maxDaily: 'Do not exceed recommended dose',
            interval: 'Follow prescription instructions',
            note: 'Consult healthcare provider for specific dosing'
        };
    }
}

// Medicine Interaction Checker
class MedicineInteractionChecker {
    constructor() {
        this.interactionDatabase = this.loadInteractionDatabase();
    }

    loadInteractionDatabase() {
        return {
            'warfarin': {
                'aspirin': { severity: 'high', description: 'Increased bleeding risk' },
                'ibuprofen': { severity: 'medium', description: 'May increase anticoagulant effect' },
                'acetaminophen': { severity: 'low', description: 'Generally safe combination' }
            },
            'metformin': {
                'alcohol': { severity: 'high', description: 'Risk of lactic acidosis' },
                'iodinated contrast': { severity: 'high', description: 'Risk of kidney damage' }
            },
            'lisinopril': {
                'potassium supplements': { severity: 'medium', description: 'Risk of hyperkalemia' },
                'nsaids': { severity: 'medium', description: 'Reduced antihypertensive effect' }
            }
        };
    }

    checkInteractions(medicines) {
        const interactions = [];
        
        for (let i = 0; i < medicines.length; i++) {
            for (let j = i + 1; j < medicines.length; j++) {
                const interaction = this.findInteraction(medicines[i], medicines[j]);
                if (interaction) {
                    interactions.push({
                        medicine1: medicines[i],
                        medicine2: medicines[j],
                        ...interaction
                    });
                }
            }
        }
        
        return this.sortInteractionsBySeverity(interactions);
    }

    findInteraction(med1, med2) {
        const name1 = this.extractGenericName(med1).toLowerCase();
        const name2 = this.extractGenericName(med2).toLowerCase();
        
        // Check both directions
        if (this.interactionDatabase[name1] && this.interactionDatabase[name1][name2]) {
            return this.interactionDatabase[name1][name2];
        }
        
        if (this.interactionDatabase[name2] && this.interactionDatabase[name2][name1]) {
            return this.interactionDatabase[name2][name1];
        }
        
        // Check for class-based interactions
        return this.checkClassInteractions(name1, name2);
    }

    extractGenericName(medicine) {
        if (typeof medicine === 'string') {
            return medicine.split('(')[0].trim();
        }
        return medicine.name ? medicine.name.split('(')[0].trim() : '';
    }

    checkClassInteractions(med1, med2) {
        const drugClasses = {
            'nsaids': ['ibuprofen', 'naproxen', 'diclofenac', 'celecoxib'],
            'ace_inhibitors': ['lisinopril', 'enalapril', 'captopril'],
            'beta_blockers': ['metoprolol', 'atenolol', 'propranolol'],
            'statins': ['atorvastatin', 'simvastatin', 'rosuvastatin']
        };
        
        // Find classes for each medicine
        const class1 = this.findDrugClass(med1, drugClasses);
        const class2 = this.findDrugClass(med2, drugClasses);
        
        // Check for known class interactions
        if (class1 === 'nsaids' && class2 === 'ace_inhibitors') {
            return {
                severity: 'medium',
                description: 'NSAIDs may reduce the effectiveness of ACE inhibitors'
            };
        }
        
        return null;
    }

    findDrugClass(medicine, drugClasses) {
        for (const [className, drugs] of Object.entries(drugClasses)) {
            if (drugs.some(drug => medicine.includes(drug))) {
                return className;
            }
        }
        return null;
    }

    sortInteractionsBySeverity(interactions) {
        const severityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
        return interactions.sort((a, b) => 
            (severityOrder[b.severity] || 0) - (severityOrder[a.severity] || 0)
        );
    }
}

// Smart Pill Reminder System
class SmartPillReminder {
    constructor() {
        this.reminders = this.loadReminders();
        this.notifications = [];
        this.initializeNotifications();
    }

    loadReminders() {
        return JSON.parse(localStorage.getItem('pillReminders') || '[]');
    }

    saveReminders() {
        localStorage.setItem('pillReminders', JSON.stringify(this.reminders));
    }

    addReminder(reminderData) {
        const reminder = {
            id: Date.now(),
            ...reminderData,
            createdAt: new Date().toISOString(),
            active: true,
            missedDoses: 0,
            takenDoses: 0
        };
        
        this.reminders.push(reminder);
        this.saveReminders();
        this.scheduleNotifications(reminder);
        
        return reminder;
    }

    scheduleNotifications(reminder) {
        if (!('Notification' in window)) {
            console.warn('This browser does not support notifications');
            return;
        }

        // Request permission if not already granted
        if (Notification.permission === 'default') {
            Notification.requestPermission();
        }

        // Schedule notifications for each time
        reminder.times.forEach(time => {
            this.scheduleTimeNotification(reminder, time);
        });
    }

    scheduleTimeNotification(reminder, time) {
        const now = new Date();
        const [hours, minutes] = time.split(':').map(Number);
        
        let notificationTime = new Date();
        notificationTime.setHours(hours, minutes, 0, 0);
        
        // If time has passed today, schedule for tomorrow
        if (notificationTime <= now) {
            notificationTime.setDate(notificationTime.getDate() + 1);
        }
        
        const timeUntilNotification = notificationTime.getTime() - now.getTime();
        
        setTimeout(() => {
            this.showPillNotification(reminder);
            // Schedule next day's notification
            this.scheduleTimeNotification(reminder, time);
        }, timeUntilNotification);
    }

    showPillNotification(reminder) {
        if (Notification.permission === 'granted') {
            const notification = new Notification(`Time for ${reminder.medicineName}`, {
                body: `Take ${reminder.dosage} as prescribed`,
                icon: '/logo.png',
                badge: '/logo.png',
                tag: `pill-${reminder.id}`,
                requireInteraction: true,
                actions: [
                    { action: 'taken', title: 'Mark as Taken' },
                    { action: 'snooze', title: 'Snooze 15 min' }
                ]
            });

            notification.onclick = () => {
                this.markAsTaken(reminder.id);
                notification.close();
            };
        }
    }

    markAsTaken(reminderId) {
        const reminder = this.reminders.find(r => r.id === reminderId);
        if (reminder) {
            reminder.takenDoses++;
            reminder.lastTaken = new Date().toISOString();
            this.saveReminders();
            
            // Show success notification
            if (window.showNotification) {
                window.showNotification(`${reminder.medicineName} marked as taken`, 'success');
            }
        }
    }

    markAsMissed(reminderId) {
        const reminder = this.reminders.find(r => r.id === reminderId);
        if (reminder) {
            reminder.missedDoses++;
            this.saveReminders();
        }
    }

    snoozeReminder(reminderId, minutes = 15) {
        setTimeout(() => {
            const reminder = this.reminders.find(r => r.id === reminderId);
            if (reminder) {
                this.showPillNotification(reminder);
            }
        }, minutes * 60 * 1000);
    }

    getAdherenceStats(reminderId) {
        const reminder = this.reminders.find(r => r.id === reminderId);
        if (!reminder) return null;
        
        const totalDoses = reminder.takenDoses + reminder.missedDoses;
        const adherenceRate = totalDoses > 0 ? (reminder.takenDoses / totalDoses) * 100 : 0;
        
        return {
            adherenceRate: Math.round(adherenceRate),
            takenDoses: reminder.takenDoses,
            missedDoses: reminder.missedDoses,
            totalDoses
        };
    }

    initializeNotifications() {
        // Set up service worker for background notifications if available
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js').catch(err => {
                console.log('Service Worker registration failed:', err);
            });
        }
    }
}

// Initialize advanced features
document.addEventListener('DOMContentLoaded', function() {
    // Initialize recommendation engine
    window.recommendationEngine = new MedicineRecommendationEngine();
    
    // Initialize dosage calculator
    window.dosageCalculator = new SmartDosageCalculator();
    
    // Initialize interaction checker
    window.interactionChecker = new MedicineInteractionChecker();
    
    // Initialize pill reminder
    window.pillReminder = new SmartPillReminder();
    
    console.log('Advanced features initialized');
});

// Export classes for use in other modules
window.MedicineRecommendationEngine = MedicineRecommendationEngine;
window.SmartDosageCalculator = SmartDosageCalculator;
window.MedicineInteractionChecker = MedicineInteractionChecker;
window.SmartPillReminder = SmartPillReminder;//
 Enhanced UI Controller for Health Features
class HealthUIController {
    constructor() {
        this.isHealthDashboardVisible = false;
        this.initializeUI();
    }

    initializeUI() {
        this.setupHealthDashboardToggle();
        this.setupSymptomTracker();
        this.setupVitalsInput();
        this.updateHealthDisplay();
    }

    setupHealthDashboardToggle() {
        // Add health dashboard toggle button to navigation
        const navLinks = document.querySelector('.nav-links');
        if (navLinks) {
            const healthToggle = document.createElement('a');
            healthToggle.href = '#';
            healthToggle.innerHTML = '<i class="fas fa-chart-line"></i> Health Dashboard';
            healthToggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleHealthDashboard();
            });
            navLinks.appendChild(healthToggle);
        }
    }

    toggleHealthDashboard() {
        this.isHealthDashboardVisible = !this.isHealthDashboardVisible;
        
        const elements = [
            'healthScoreWidget',
            'vitalsGrid',
            'healthInsights',
            'symptomTracker'
        ];

        elements.forEach(elementId => {
            const element = document.getElementById(elementId);
            if (element) {
                element.style.display = this.isHealthDashboardVisible ? 'block' : 'none';
            }
        });

        if (this.isHealthDashboardVisible) {
            this.updateHealthDisplay();
            this.loadRecentSymptoms();
        }
    }

    setupSymptomTracker() {
        // Add global function for adding symptoms
        window.addSymptom = () => {
            const symptomInput = document.getElementById('symptomInput');
            const severitySelect = document.getElementById('severitySelect');
            
            if (!symptomInput || !severitySelect) return;
            
            const symptom = symptomInput.value.trim();
            const severity = parseInt(severitySelect.value);
            
            if (!symptom) {
                if (window.showNotification) {
                    window.showNotification('Please enter a symptom', 'warning');
                }
                return;
            }

            if (window.healthMonitor) {
                window.healthMonitor.recordSymptom(symptom, severity, '');
                symptomInput.value = '';
                severitySelect.value = '1';
                this.loadRecentSymptoms();
                
                if (window.showNotification) {
                    window.showNotification('Symptom recorded successfully', 'success');
                }
            }
        };

        // Setup enter key listener for symptom input
        const symptomInput = document.getElementById('symptomInput');
        if (symptomInput) {
            symptomInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    window.addSymptom();
                }
            });
        }
    }

    setupVitalsInput() {
        // Create vitals input modal
        this.createVitalsInputModal();
        
        // Add vitals input buttons to each vital card
        const vitalCards = document.querySelectorAll('.vital-card');
        vitalCards.forEach(card => {
            const button = document.createElement('button');
            button.className = 'vital-input-btn';
            button.innerHTML = '<i class="fas fa-plus"></i>';
            button.title = 'Add reading';
            button.onclick = () => this.openVitalsInput(card);
            card.appendChild(button);
        });
    }

    createVitalsInputModal() {
        const modal = document.createElement('div');
        modal.id = 'vitalsInputModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2><i class="fas fa-heartbeat"></i> Record Vital Signs</h2>
                    <span class="close" onclick="closeModal('vitalsInputModal')">&times;</span>
                </div>
                <div class="vitals-input-content">
                    <div class="form-group">
                        <label for="vitalType">Vital Sign Type</label>
                        <select id="vitalType">
                            <option value="heartRate">Heart Rate (bpm)</option>
                            <option value="bloodPressure">Blood Pressure (systolic/diastolic)</option>
                            <option value="temperature">Temperature (°F)</option>
                            <option value="bloodSugar">Blood Sugar (mg/dL)</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="vitalValue">Value</label>
                        <input type="text" id="vitalValue" placeholder="Enter value">
                        <small id="vitalHint">Enter heart rate in beats per minute</small>
                    </div>
                    <div class="form-group">
                        <label for="vitalNotes">Notes (optional)</label>
                        <textarea id="vitalNotes" placeholder="Any additional notes..."></textarea>
                    </div>
                    <button class="btn-primary" onclick="recordVital()">Record Vital</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // Setup vital type change handler
        const vitalTypeSelect = document.getElementById('vitalType');
        if (vitalTypeSelect) {
            vitalTypeSelect.addEventListener('change', this.updateVitalHint);
        }
    }

    updateVitalHint() {
        const vitalType = document.getElementById('vitalType').value;
        const vitalHint = document.getElementById('vitalHint');
        const vitalValue = document.getElementById('vitalValue');
        
        const hints = {
            'heartRate': 'Enter heart rate in beats per minute (e.g., 72)',
            'bloodPressure': 'Enter as systolic/diastolic (e.g., 120/80)',
            'temperature': 'Enter temperature in Fahrenheit (e.g., 98.6)',
            'bloodSugar': 'Enter blood sugar in mg/dL (e.g., 100)'
        };

        const placeholders = {
            'heartRate': '72',
            'bloodPressure': '120/80',
            'temperature': '98.6',
            'bloodSugar': '100'
        };

        if (vitalHint) vitalHint.textContent = hints[vitalType];
        if (vitalValue) vitalValue.placeholder = placeholders[vitalType];
    }

    openVitalsInput(card) {
        const modal = document.getElementById('vitalsInputModal');
        if (modal) {
            modal.style.display = 'flex';
            
            // Pre-select the vital type based on the card
            const vitalType = this.getVitalTypeFromCard(card);
            const vitalTypeSelect = document.getElementById('vitalType');
            if (vitalTypeSelect && vitalType) {
                vitalTypeSelect.value = vitalType;
                this.updateVitalHint();
            }
        }
    }

    getVitalTypeFromCard(card) {
        const title = card.querySelector('h4').textContent.toLowerCase();
        if (title.includes('heart')) return 'heartRate';
        if (title.includes('blood pressure')) return 'bloodPressure';
        if (title.includes('temperature')) return 'temperature';
        if (title.includes('blood sugar')) return 'bloodSugar';
        return 'heartRate';
    }

    updateHealthDisplay() {
        if (!window.healthMonitor) return;

        // Update health score
        const healthScore = window.healthMonitor.calculateHealthScore();
        const healthScoreElement = document.getElementById('healthScoreNumber');
        if (healthScoreElement) {
            healthScoreElement.textContent = healthScore;
            
            // Add color coding
            const widget = document.getElementById('healthScoreWidget');
            if (widget) {
                widget.className = 'health-score-widget';
                if (healthScore >= 80) widget.classList.add('excellent');
                else if (healthScore >= 60) widget.classList.add('good');
                else widget.classList.add('needs-attention');
            }
        }

        // Update vitals display
        if (window.healthMonitor.vitals) {
            window.healthMonitor.updateVitalSignsDisplay();
        }

        // Update health insights
        this.updateHealthInsights();
    }

    updateHealthInsights() {
        if (!window.healthAnalytics) return;

        const insights = window.healthAnalytics.generateHealthInsights();
        const insightsList = document.getElementById('insightsList');
        
        if (insightsList && insights.length > 0) {
            insightsList.innerHTML = insights.map(insight => `
                <div class="insight-item">
                    <strong>${insight.title}</strong>
                    <span class="insight-priority ${insight.priority}">${insight.priority}</span>
                    <p>${insight.message}</p>
                    ${insight.action ? `<button class="btn-secondary" onclick="handleInsightAction('${insight.action}')">${insight.action}</button>` : ''}
                </div>
            `).join('');
        } else if (insightsList) {
            insightsList.innerHTML = '<p style="color: #666; text-align: center;">No health insights available yet. Start tracking your health data!</p>';
        }
    }

    loadRecentSymptoms() {
        if (!window.healthMonitor) return;

        const symptoms = window.healthMonitor.symptoms.slice(0, 5);
        const symptomsList = document.getElementById('symptomsList');
        
        if (symptomsList) {
            if (symptoms.length === 0) {
                symptomsList.innerHTML = '<p style="color: #666; text-align: center;">No symptoms recorded yet</p>';
            } else {
                symptomsList.innerHTML = symptoms.map(symptom => {
                    const severityClass = symptom.severity >= 7 ? 'high' : symptom.severity >= 4 ? 'medium' : 'low';
                    const date = new Date(symptom.timestamp).toLocaleDateString();
                    
                    return `
                        <div class="symptom-item">
                            <div>
                                <strong>${symptom.symptom}</strong>
                                <small style="color: #666; margin-left: 1rem;">${date}</small>
                            </div>
                            <div class="symptom-severity ${severityClass}">${symptom.severity}/10</div>
                        </div>
                    `;
                }).join('');
            }
        }
    }
}

// Global functions for UI interactions
window.recordVital = function() {
    const vitalType = document.getElementById('vitalType').value;
    const vitalValue = document.getElementById('vitalValue').value.trim();
    const vitalNotes = document.getElementById('vitalNotes').value.trim();
    
    if (!vitalValue) {
        if (window.showNotification) {
            window.showNotification('Please enter a value', 'warning');
        }
        return;
    }

    // Validate input based on type
    if (!validateVitalInput(vitalType, vitalValue)) {
        return;
    }

    const units = {
        'heartRate': 'bpm',
        'bloodPressure': 'mmHg',
        'temperature': '°F',
        'bloodSugar': 'mg/dL'
    };

    if (window.healthMonitor) {
        window.healthMonitor.recordVitals(vitalType, vitalValue, units[vitalType]);
        
        // Clear form
        document.getElementById('vitalValue').value = '';
        document.getElementById('vitalNotes').value = '';
        
        // Close modal
        closeModal('vitalsInputModal');
        
        // Update display
        if (window.healthUIController) {
            window.healthUIController.updateHealthDisplay();
        }
        
        if (window.showNotification) {
            window.showNotification('Vital signs recorded successfully', 'success');
        }
    }
};

function validateVitalInput(type, value) {
    switch(type) {
        case 'heartRate':
            const hr = parseInt(value);
            if (isNaN(hr) || hr < 30 || hr > 220) {
                if (window.showNotification) {
                    window.showNotification('Heart rate must be between 30-220 bpm', 'error');
                }
                return false;
            }
            break;
        case 'bloodPressure':
            const bpPattern = /^\d{2,3}\/\d{2,3}$/;
            if (!bpPattern.test(value)) {
                if (window.showNotification) {
                    window.showNotification('Blood pressure must be in format: systolic/diastolic (e.g., 120/80)', 'error');
                }
                return false;
            }
            break;
        case 'temperature':
            const temp = parseFloat(value);
            if (isNaN(temp) || temp < 90 || temp > 110) {
                if (window.showNotification) {
                    window.showNotification('Temperature must be between 90-110°F', 'error');
                }
                return false;
            }
            break;
        case 'bloodSugar':
            const bs = parseInt(value);
            if (isNaN(bs) || bs < 20 || bs > 600) {
                if (window.showNotification) {
                    window.showNotification('Blood sugar must be between 20-600 mg/dL', 'error');
                }
                return false;
            }
            break;
    }
    return true;
}

window.handleInsightAction = function(action) {
    switch(action) {
        case 'Set Reminders':
            openPillReminder();
            break;
        case 'Consult Doctor':
            if (window.showNotification) {
                window.showNotification('Doctor consultation feature coming soon!', 'info');
            }
            break;
        case 'Schedule Appointment':
            bookAppointment();
            break;
        default:
            if (window.showNotification) {
                window.showNotification(`${action} feature coming soon!`, 'info');
            }
    }
};

// Initialize UI controller when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.healthUIController = new HealthUIController();
    console.log('Health UI Controller initialized');
});

// Export for global use
window.HealthUIController = HealthUIController;