// Settings and Preferences Management for MediView
class SettingsManager {
    constructor() {
        this.settings = this.loadSettings();
        this.defaultSettings = this.getDefaultSettings();
        this.initializeSettings();
    }

    getDefaultSettings() {
        return {
            // General preferences
            theme: 'light',
            language: 'en',
            fontSize: 'medium',
            
            // Search preferences
            searchHistory: true,
            autoComplete: true,
            imageSearch: true,
            
            // Notification preferences
            pillReminders: true,
            appointmentReminders: true,
            healthTips: true,
            systemNotifications: true,
            
            // Privacy preferences
            dataCollection: true,
            analytics: true,
            locationServices: false,
            
            // Accessibility preferences
            highContrast: false,
            largeText: false,
            screenReader: false,
            reducedMotion: false,
            
            // Medical preferences
            preferGeneric: false,
            showPrices: true,
            showSideEffects: true,
            medicalUnits: 'metric',
            
            // Student mode preferences
            studentMode: false,
            showChemicalStructures: true,
            showMechanisms: true,
            educationalContent: true
        };
    }

    loadSettings() {
        const saved = localStorage.getItem('mediviewSettings');
        if (saved) {
            try {
                return { ...this.getDefaultSettings(), ...JSON.parse(saved) };
            } catch (e) {
                console.error('Error loading settings:', e);
                return this.getDefaultSettings();
            }
        }
        return this.getDefaultSettings();
    }

    saveSettings() {
        localStorage.setItem('mediviewSettings', JSON.stringify(this.settings));
        this.applySettings();
    }

    initializeSettings() {
        this.applySettings();
        this.setupSettingsUI();
    }

    applySettings() {
        // Apply theme
        this.applyTheme();
        
        // Apply font size
        this.applyFontSize();
        
        // Apply accessibility settings
        this.applyAccessibilitySettings();
        
        // Apply student mode
        this.applyStudentMode();
        
        // Dispatch settings change event
        document.dispatchEvent(new CustomEvent('settingsChanged', {
            detail: this.settings
        }));
    }

    applyTheme() {
        const theme = this.settings.theme;
        document.documentElement.setAttribute('data-theme', theme);
        
        // Update meta theme color for mobile browsers
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.content = theme === 'dark' ? '#1a1a1a' : '#4a6cf7';
        }
    }

    applyFontSize() {
        const fontSize = this.settings.fontSize;
        const sizeMap = {
            'small': '14px',
            'medium': '16px',
            'large': '18px',
            'extra-large': '20px'
        };
        
        document.documentElement.style.setProperty('--base-font-size', sizeMap[fontSize]);
    }

    applyAccessibilitySettings() {
        const { highContrast, largeText, reducedMotion } = this.settings;
        
        // High contrast
        if (highContrast) {
            document.body.classList.add('high-contrast');
        } else {
            document.body.classList.remove('high-contrast');
        }
        
        // Large text
        if (largeText) {
            document.body.classList.add('large-text');
        } else {
            document.body.classList.remove('large-text');
        }
        
        // Reduced motion
        if (reducedMotion) {
            document.body.classList.add('reduced-motion');
        } else {
            document.body.classList.remove('reduced-motion');
        }
    }

    applyStudentMode() {
        const isStudentMode = this.settings.studentMode;
        sessionStorage.setItem('studentMode', isStudentMode.toString());
        
        // Update student mode button if it exists
        const studentBtn = document.querySelector('.action-btn.student');
        if (studentBtn) {
            if (isStudentMode) {
                studentBtn.classList.add('active');
            } else {
                studentBtn.classList.remove('active');
            }
        }
    }

    setupSettingsUI() {
        // Create settings modal if it doesn't exist
        if (!document.getElementById('settingsModal')) {
            this.createSettingsModal();
        }
        
        // Setup settings button
        this.setupSettingsButton();
    }

    createSettingsModal() {
        const modal = document.createElement('div');
        modal.id = 'settingsModal';
        modal.className = 'modal';
        modal.innerHTML = this.getSettingsModalHTML();
        document.body.appendChild(modal);
        
        // Setup event listeners
        this.setupSettingsEventListeners();
    }

    getSettingsModalHTML() {
        return `
            <div class="modal-content settings-modal-content">
                <div class="modal-header">
                    <h2><i class="fas fa-cog"></i> Settings</h2>
                    <span class="close" onclick="closeModal('settingsModal')">&times;</span>
                </div>
                <div class="settings-content">
                    <div class="settings-tabs">
                        <button class="settings-tab active" data-tab="general">General</button>
                        <button class="settings-tab" data-tab="notifications">Notifications</button>
                        <button class="settings-tab" data-tab="privacy">Privacy</button>
                        <button class="settings-tab" data-tab="accessibility">Accessibility</button>
                        <button class="settings-tab" data-tab="medical">Medical</button>
                    </div>
                    
                    <div class="settings-panels">
                        ${this.getGeneralSettingsHTML()}
                        ${this.getNotificationSettingsHTML()}
                        ${this.getPrivacySettingsHTML()}
                        ${this.getAccessibilitySettingsHTML()}
                        ${this.getMedicalSettingsHTML()}
                    </div>
                    
                    <div class="settings-actions">
                        <button class="btn-secondary" onclick="settingsManager.resetToDefaults()">Reset to Defaults</button>
                        <button class="btn-primary" onclick="settingsManager.saveSettings(); closeModal('settingsModal');">Save Settings</button>
                    </div>
                </div>
            </div>
        `;
    }

    getGeneralSettingsHTML() {
        return `
            <div class="settings-panel active" data-panel="general">
                <h3>General Settings</h3>
                
                <div class="setting-group">
                    <label for="theme-select">Theme</label>
                    <select id="theme-select" data-setting="theme">
                        <option value="light" ${this.settings.theme === 'light' ? 'selected' : ''}>Light</option>
                        <option value="dark" ${this.settings.theme === 'dark' ? 'selected' : ''}>Dark</option>
                        <option value="auto" ${this.settings.theme === 'auto' ? 'selected' : ''}>Auto</option>
                    </select>
                </div>
                
                <div class="setting-group">
                    <label for="language-select">Language</label>
                    <select id="language-select" data-setting="language">
                        <option value="en" ${this.settings.language === 'en' ? 'selected' : ''}>English</option>
                        <option value="es" ${this.settings.language === 'es' ? 'selected' : ''}>Spanish</option>
                        <option value="fr" ${this.settings.language === 'fr' ? 'selected' : ''}>French</option>
                        <option value="de" ${this.settings.language === 'de' ? 'selected' : ''}>German</option>
                    </select>
                </div>
                
                <div class="setting-group">
                    <label for="font-size-select">Font Size</label>
                    <select id="font-size-select" data-setting="fontSize">
                        <option value="small" ${this.settings.fontSize === 'small' ? 'selected' : ''}>Small</option>
                        <option value="medium" ${this.settings.fontSize === 'medium' ? 'selected' : ''}>Medium</option>
                        <option value="large" ${this.settings.fontSize === 'large' ? 'selected' : ''}>Large</option>
                        <option value="extra-large" ${this.settings.fontSize === 'extra-large' ? 'selected' : ''}>Extra Large</option>
                    </select>
                </div>
                
                <div class="setting-group">
                    <label class="checkbox-label">
                        <input type="checkbox" data-setting="searchHistory" ${this.settings.searchHistory ? 'checked' : ''}>
                        <span class="checkmark"></span>
                        Save Search History
                    </label>
                </div>
                
                <div class="setting-group">
                    <label class="checkbox-label">
                        <input type="checkbox" data-setting="autoComplete" ${this.settings.autoComplete ? 'checked' : ''}>
                        <span class="checkmark"></span>
                        Enable Auto-complete
                    </label>
                </div>
            </div>
        `;
    }

    getNotificationSettingsHTML() {
        return `
            <div class="settings-panel" data-panel="notifications">
                <h3>Notification Settings</h3>
                
                <div class="setting-group">
                    <label class="checkbox-label">
                        <input type="checkbox" data-setting="pillReminders" ${this.settings.pillReminders ? 'checked' : ''}>
                        <span class="checkmark"></span>
                        Pill Reminders
                    </label>
                </div>
                
                <div class="setting-group">
                    <label class="checkbox-label">
                        <input type="checkbox" data-setting="appointmentReminders" ${this.settings.appointmentReminders ? 'checked' : ''}>
                        <span class="checkmark"></span>
                        Appointment Reminders
                    </label>
                </div>
                
                <div class="setting-group">
                    <label class="checkbox-label">
                        <input type="checkbox" data-setting="healthTips" ${this.settings.healthTips ? 'checked' : ''}>
                        <span class="checkmark"></span>
                        Daily Health Tips
                    </label>
                </div>
                
                <div class="setting-group">
                    <label class="checkbox-label">
                        <input type="checkbox" data-setting="systemNotifications" ${this.settings.systemNotifications ? 'checked' : ''}>
                        <span class="checkmark"></span>
                        System Notifications
                    </label>
                </div>
            </div>
        `;
    }

    getPrivacySettingsHTML() {
        return `
            <div class="settings-panel" data-panel="privacy">
                <h3>Privacy Settings</h3>
                
                <div class="setting-group">
                    <label class="checkbox-label">
                        <input type="checkbox" data-setting="dataCollection" ${this.settings.dataCollection ? 'checked' : ''}>
                        <span class="checkmark"></span>
                        Allow Data Collection for Improvement
                    </label>
                </div>
                
                <div class="setting-group">
                    <label class="checkbox-label">
                        <input type="checkbox" data-setting="analytics" ${this.settings.analytics ? 'checked' : ''}>
                        <span class="checkmark"></span>
                        Enable Analytics
                    </label>
                </div>
                
                <div class="setting-group">
                    <label class="checkbox-label">
                        <input type="checkbox" data-setting="locationServices" ${this.settings.locationServices ? 'checked' : ''}>
                        <span class="checkmark"></span>
                        Location Services
                    </label>
                </div>
                
                <div class="setting-group">
                    <button class="btn-warning" onclick="healthAnalytics.anonymizeData()">
                        <i class="fas fa-user-secret"></i> Anonymize My Data
                    </button>
                </div>
                
                <div class="setting-group">
                    <button class="btn-danger" onclick="healthAnalytics.clearAllData()">
                        <i class="fas fa-trash"></i> Clear All Data
                    </button>
                </div>
            </div>
        `;
    }

    getAccessibilitySettingsHTML() {
        return `
            <div class="settings-panel" data-panel="accessibility">
                <h3>Accessibility Settings</h3>
                
                <div class="setting-group">
                    <label class="checkbox-label">
                        <input type="checkbox" data-setting="highContrast" ${this.settings.highContrast ? 'checked' : ''}>
                        <span class="checkmark"></span>
                        High Contrast Mode
                    </label>
                </div>
                
                <div class="setting-group">
                    <label class="checkbox-label">
                        <input type="checkbox" data-setting="largeText" ${this.settings.largeText ? 'checked' : ''}>
                        <span class="checkmark"></span>
                        Large Text
                    </label>
                </div>
                
                <div class="setting-group">
                    <label class="checkbox-label">
                        <input type="checkbox" data-setting="reducedMotion" ${this.settings.reducedMotion ? 'checked' : ''}>
                        <span class="checkmark"></span>
                        Reduce Motion
                    </label>
                </div>
                
                <div class="setting-group">
                    <label class="checkbox-label">
                        <input type="checkbox" data-setting="screenReader" ${this.settings.screenReader ? 'checked' : ''}>
                        <span class="checkmark"></span>
                        Screen Reader Support
                    </label>
                </div>
            </div>
        `;
    }

    getMedicalSettingsHTML() {
        return `
            <div class="settings-panel" data-panel="medical">
                <h3>Medical Preferences</h3>
                
                <div class="setting-group">
                    <label class="checkbox-label">
                        <input type="checkbox" data-setting="preferGeneric" ${this.settings.preferGeneric ? 'checked' : ''}>
                        <span class="checkmark"></span>
                        Prefer Generic Medicines
                    </label>
                </div>
                
                <div class="setting-group">
                    <label class="checkbox-label">
                        <input type="checkbox" data-setting="showPrices" ${this.settings.showPrices ? 'checked' : ''}>
                        <span class="checkmark"></span>
                        Show Medicine Prices
                    </label>
                </div>
                
                <div class="setting-group">
                    <label class="checkbox-label">
                        <input type="checkbox" data-setting="showSideEffects" ${this.settings.showSideEffects ? 'checked' : ''}>
                        <span class="checkmark"></span>
                        Always Show Side Effects
                    </label>
                </div>
                
                <div class="setting-group">
                    <label for="units-select">Measurement Units</label>
                    <select id="units-select" data-setting="medicalUnits">
                        <option value="metric" ${this.settings.medicalUnits === 'metric' ? 'selected' : ''}>Metric (mg, ml)</option>
                        <option value="imperial" ${this.settings.medicalUnits === 'imperial' ? 'selected' : ''}>Imperial (gr, fl oz)</option>
                    </select>
                </div>
                
                <div class="setting-group">
                    <label class="checkbox-label">
                        <input type="checkbox" data-setting="studentMode" ${this.settings.studentMode ? 'checked' : ''}>
                        <span class="checkmark"></span>
                        Student Mode (Show Chemical Structures)
                    </label>
                </div>
            </div>
        `;
    }

    setupSettingsEventListeners() {
        const modal = document.getElementById('settingsModal');
        
        // Tab switching
        modal.querySelectorAll('.settings-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = tab.dataset.tab;
                this.switchTab(tabName);
            });
        });
        
        // Setting changes
        modal.querySelectorAll('[data-setting]').forEach(input => {
            input.addEventListener('change', (e) => {
                const setting = e.target.dataset.setting;
                const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
                this.updateSetting(setting, value);
            });
        });
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.settings-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabName);
        });
        
        // Update panels
        document.querySelectorAll('.settings-panel').forEach(panel => {
            panel.classList.toggle('active', panel.dataset.panel === tabName);
        });
    }

    updateSetting(key, value) {
        this.settings[key] = value;
        // Apply immediately for better UX
        this.applySettings();
    }

    setupSettingsButton() {
        // Add settings button to header if it doesn't exist
        const header = document.querySelector('header .header-container');
        if (header && !document.getElementById('settingsBtn')) {
            const settingsBtn = document.createElement('button');
            settingsBtn.id = 'settingsBtn';
            settingsBtn.className = 'settings-btn';
            settingsBtn.innerHTML = '<i class="fas fa-cog"></i>';
            settingsBtn.title = 'Settings';
            settingsBtn.addEventListener('click', () => this.openSettings());
            
            // Insert before menu button
            const menuBtn = header.querySelector('.menu-btn');
            if (menuBtn) {
                header.insertBefore(settingsBtn, menuBtn);
            } else {
                header.appendChild(settingsBtn);
            }
        }
    }

    openSettings() {
        const modal = document.getElementById('settingsModal');
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }

    resetToDefaults() {
        if (confirm('Are you sure you want to reset all settings to defaults?')) {
            this.settings = { ...this.defaultSettings };
            this.saveSettings();
            
            // Update UI
            this.updateSettingsUI();
            
            if (window.showNotification) {
                window.showNotification('Settings reset to defaults', 'success');
            }
        }
    }

    updateSettingsUI() {
        const modal = document.getElementById('settingsModal');
        if (modal) {
            // Update all form elements
            modal.querySelectorAll('[data-setting]').forEach(input => {
                const setting = input.dataset.setting;
                const value = this.settings[setting];
                
                if (input.type === 'checkbox') {
                    input.checked = value;
                } else {
                    input.value = value;
                }
            });
        }
    }

    exportSettings() {
        const settingsData = {
            settings: this.settings,
            exportedAt: new Date().toISOString(),
            version: '1.0.0'
        };
        
        const blob = new Blob([JSON.stringify(settingsData, null, 2)], {
            type: 'application/json'
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'mediview-settings.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    importSettings(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (data.settings) {
                    this.settings = { ...this.defaultSettings, ...data.settings };
                    this.saveSettings();
                    this.updateSettingsUI();
                    
                    if (window.showNotification) {
                        window.showNotification('Settings imported successfully', 'success');
                    }
                }
            } catch (error) {
                if (window.showNotification) {
                    window.showNotification('Error importing settings', 'error');
                }
            }
        };
        reader.readAsText(file);
    }
}

// Initialize settings manager
document.addEventListener('DOMContentLoaded', function() {
    window.settingsManager = new SettingsManager();
    console.log('Settings Manager initialized');
});

// Export for global use
window.SettingsManager = SettingsManager;