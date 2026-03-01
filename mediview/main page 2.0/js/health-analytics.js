// Health Analytics Dashboard for MediView
class HealthAnalytics {
    constructor() {
        this.userData = this.loadUserData();
        this.medicationHistory = this.loadMedicationHistory();
        this.healthMetrics = this.loadHealthMetrics();
        this.initializeAnalytics();
    }

    loadUserData() {
        return JSON.parse(localStorage.getItem('userData') || '{}');
    }

    loadMedicationHistory() {
        return JSON.parse(localStorage.getItem('medicationHistory') || '[]');
    }

    loadHealthMetrics() {
        return JSON.parse(localStorage.getItem('healthMetrics') || '{}');
    }

    initializeAnalytics() {
        this.setupEventListeners();
        this.startPeriodicUpdates();
    }

    setupEventListeners() {
        // Listen for medication events
        document.addEventListener('medicationTaken', (e) => {
            this.recordMedicationEvent(e.detail);
        });

        // Listen for search events
        document.addEventListener('medicineSearched', (e) => {
            this.recordSearchEvent(e.detail);
        });
    }

    recordMedicationEvent(eventData) {
        const event = {
            id: Date.now(),
            type: 'medication_taken',
            medicine: eventData.medicine,
            timestamp: new Date().toISOString(),
            adherence: eventData.onTime || false
        };

        this.medicationHistory.unshift(event);
        this.medicationHistory = this.medicationHistory.slice(0, 1000); // Keep last 1000 events
        
        localStorage.setItem('medicationHistory', JSON.stringify(this.medicationHistory));
        this.updateHealthMetrics();
    }

    recordSearchEvent(eventData) {
        const searchData = {
            query: eventData.query,
            results: eventData.results,
            timestamp: new Date().toISOString(),
            category: this.categorizeSearch(eventData.query)
        };

        // Update search analytics
        if (!this.healthMetrics.searchAnalytics) {
            this.healthMetrics.searchAnalytics = {};
        }

        const category = searchData.category;
        if (!this.healthMetrics.searchAnalytics[category]) {
            this.healthMetrics.searchAnalytics[category] = 0;
        }
        this.healthMetrics.searchAnalytics[category]++;

        this.saveHealthMetrics();
    }

    categorizeSearch(query) {
        const categories = {
            'pain': ['pain', 'ache', 'hurt', 'sore'],
            'fever': ['fever', 'temperature', 'hot'],
            'cold': ['cold', 'flu', 'cough', 'sneeze'],
            'allergy': ['allergy', 'allergic', 'reaction'],
            'stomach': ['stomach', 'nausea', 'vomit', 'digest'],
            'sleep': ['sleep', 'insomnia', 'tired'],
            'anxiety': ['anxiety', 'stress', 'worry', 'panic']
        };

        const lowerQuery = query.toLowerCase();
        for (const [category, keywords] of Object.entries(categories)) {
            if (keywords.some(keyword => lowerQuery.includes(keyword))) {
                return category;
            }
        }
        return 'general';
    }

    updateHealthMetrics() {
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        
        // Calculate medication adherence
        const recentMedications = this.medicationHistory.filter(event => 
            new Date(event.timestamp) >= thirtyDaysAgo
        );

        const adherentMedications = recentMedications.filter(event => event.adherence);
        const adherenceRate = recentMedications.length > 0 
            ? (adherentMedications.length / recentMedications.length) * 100 
            : 0;

        // Calculate health trends
        const healthTrends = this.calculateHealthTrends();

        this.healthMetrics = {
            ...this.healthMetrics,
            adherenceRate: Math.round(adherenceRate),
            totalMedications: recentMedications.length,
            healthTrends,
            lastUpdated: now.toISOString()
        };

        this.saveHealthMetrics();
    }

    calculateHealthTrends() {
        const trends = {};
        const now = new Date();
        const periods = [7, 14, 30]; // days

        periods.forEach(days => {
            const periodStart = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
            const periodMedications = this.medicationHistory.filter(event =>
                new Date(event.timestamp) >= periodStart
            );

            trends[`${days}days`] = {
                medicationCount: periodMedications.length,
                uniqueMedicines: [...new Set(periodMedications.map(m => m.medicine))].length,
                adherenceRate: this.calculateAdherenceForPeriod(periodMedications)
            };
        });

        return trends;
    }

    calculateAdherenceForPeriod(medications) {
        if (medications.length === 0) return 0;
        const adherent = medications.filter(m => m.adherence).length;
        return Math.round((adherent / medications.length) * 100);
    }

    generateHealthInsights() {
        const insights = [];
        const metrics = this.healthMetrics;

        // Adherence insights
        if (metrics.adherenceRate < 80) {
            insights.push({
                type: 'warning',
                title: 'Medication Adherence',
                message: `Your medication adherence is ${metrics.adherenceRate}%. Try setting more reminders.`,
                action: 'Set Reminders',
                priority: 'high'
            });
        } else if (metrics.adherenceRate >= 95) {
            insights.push({
                type: 'success',
                title: 'Excellent Adherence',
                message: `Great job! Your medication adherence is ${metrics.adherenceRate}%.`,
                priority: 'low'
            });
        }

        // Search pattern insights
        if (metrics.searchAnalytics) {
            const topCategory = Object.entries(metrics.searchAnalytics)
                .sort(([,a], [,b]) => b - a)[0];
            
            if (topCategory && topCategory[1] > 5) {
                insights.push({
                    type: 'info',
                    title: 'Health Focus Area',
                    message: `You've been searching frequently for ${topCategory[0]} related medicines.`,
                    action: 'Consult Doctor',
                    priority: 'medium'
                });
            }
        }

        // Trend insights
        if (metrics.healthTrends) {
            const recent = metrics.healthTrends['7days'];
            const previous = metrics.healthTrends['14days'];
            
            if (recent.medicationCount > previous.medicationCount * 1.5) {
                insights.push({
                    type: 'warning',
                    title: 'Increased Medication Use',
                    message: 'Your medication usage has increased recently. Consider consulting your doctor.',
                    action: 'Schedule Appointment',
                    priority: 'high'
                });
            }
        }

        return insights.sort((a, b) => {
            const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
            return priorityOrder[b.priority] - priorityOrder[a.priority];
        });
    }

    generateHealthReport() {
        const report = {
            period: '30 days',
            generatedAt: new Date().toISOString(),
            summary: {
                adherenceRate: this.healthMetrics.adherenceRate,
                totalMedications: this.healthMetrics.totalMedications,
                uniqueMedicines: this.getUniqueMedicinesCount(),
                searchQueries: this.getTotalSearchQueries()
            },
            trends: this.healthMetrics.healthTrends,
            insights: this.generateHealthInsights(),
            recommendations: this.generateRecommendations()
        };

        return report;
    }

    getUniqueMedicinesCount() {
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const recentMedications = this.medicationHistory.filter(event =>
            new Date(event.timestamp) >= thirtyDaysAgo
        );
        return [...new Set(recentMedications.map(m => m.medicine))].length;
    }

    getTotalSearchQueries() {
        if (!this.healthMetrics.searchAnalytics) return 0;
        return Object.values(this.healthMetrics.searchAnalytics).reduce((sum, count) => sum + count, 0);
    }

    generateRecommendations() {
        const recommendations = [];
        const metrics = this.healthMetrics;

        if (metrics.adherenceRate < 90) {
            recommendations.push({
                category: 'Medication Management',
                suggestion: 'Set up automated pill reminders to improve adherence',
                impact: 'High'
            });
        }

        if (this.getTotalSearchQueries() > 20) {
            recommendations.push({
                category: 'Health Education',
                suggestion: 'Consider subscribing to health newsletters for reliable information',
                impact: 'Medium'
            });
        }

        recommendations.push({
            category: 'Preventive Care',
            suggestion: 'Schedule regular check-ups with your healthcare provider',
            impact: 'High'
        });

        return recommendations;
    }

    exportHealthData() {
        const exportData = {
            userData: this.userData,
            medicationHistory: this.medicationHistory,
            healthMetrics: this.healthMetrics,
            healthReport: this.generateHealthReport(),
            exportedAt: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
            type: 'application/json'
        });

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `mediview-health-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    saveHealthMetrics() {
        localStorage.setItem('healthMetrics', JSON.stringify(this.healthMetrics));
    }

    startPeriodicUpdates() {
        // Update metrics every hour
        setInterval(() => {
            this.updateHealthMetrics();
        }, 60 * 60 * 1000);
    }

    // Privacy and data management
    clearAllData() {
        if (confirm('Are you sure you want to clear all health data? This action cannot be undone.')) {
            localStorage.removeItem('userData');
            localStorage.removeItem('medicationHistory');
            localStorage.removeItem('healthMetrics');
            localStorage.removeItem('pillReminders');
            localStorage.removeItem('searchHistory');
            
            this.userData = {};
            this.medicationHistory = [];
            this.healthMetrics = {};
            
            if (window.showNotification) {
                window.showNotification('All health data has been cleared', 'success');
            }
        }
    }

    anonymizeData() {
        // Remove personally identifiable information
        this.userData = {
            ...this.userData,
            name: 'Anonymous User',
            email: 'anonymous@example.com',
            phone: 'XXX-XXX-XXXX'
        };
        
        localStorage.setItem('userData', JSON.stringify(this.userData));
        
        if (window.showNotification) {
            window.showNotification('Personal data has been anonymized', 'success');
        }
    }
}

// Initialize health analytics
document.addEventListener('DOMContentLoaded', function() {
    window.healthAnalytics = new HealthAnalytics();
    console.log('Health Analytics initialized');
});

// Export for global use
window.HealthAnalytics = HealthAnalytics;