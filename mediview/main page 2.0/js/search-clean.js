// Clean search functionality for medicine details page
document.addEventListener('DOMContentLoaded', function() {
    // Check if we need to open any modals based on session storage
    if (sessionStorage.getItem('openInteractionChecker') === 'true') {
        sessionStorage.removeItem('openInteractionChecker');
        // Redirect back to main page since interaction checker is there
        window.location.href = 'index.html#interaction-checker';
    }
    
    if (sessionStorage.getItem('openPillReminder') === 'true') {
        sessionStorage.removeItem('openPillReminder');
        // Redirect back to main page since pill reminder is there
        window.location.href = 'index.html#pill-reminder';
    }
    
    // Initialize any page-specific functionality
    initializeMedicineDetailsPage();
});

function initializeMedicineDetailsPage() {
    // Add any initialization code specific to medicine details page
    console.log('Medicine details page initialized');
    
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add loading states for interactive elements
    addLoadingStates();
}

function addLoadingStates() {
    // Add loading states to buttons that might take time to process
    const interactiveButtons = document.querySelectorAll('.feature-btn, .btn-primary, .btn-secondary');
    
    interactiveButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (!this.classList.contains('loading')) {
                this.classList.add('loading');
                const originalText = this.innerHTML;
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
                
                // Remove loading state after a short delay
                setTimeout(() => {
                    this.classList.remove('loading');
                    this.innerHTML = originalText;
                }, 1000);
            }
        });
    });
}

// Utility functions for medicine details page
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
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

// Export functions for global use
window.showNotification = showNotification;