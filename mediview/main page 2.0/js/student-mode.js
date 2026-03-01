// Student Mode Functionality
document.addEventListener('DOMContentLoaded', function() {
    const studentModeBtn = document.getElementById('studentModeBtn');
    
    if (!studentModeBtn) {
        console.log('Student mode button not found');
        return;
    }

    // Check if student mode is already active
    let isStudentMode = sessionStorage.getItem('studentMode') === 'true';
    
    // Update button state on load
    if (isStudentMode) {
        studentModeBtn.classList.add('active');
        studentModeBtn.setAttribute('aria-pressed', 'true');
        studentModeBtn.style.background = 'rgba(74, 108, 247, 0.8)';
        studentModeBtn.style.color = 'white';
    }

    // Toggle student mode
    studentModeBtn.addEventListener('click', function() {
        isStudentMode = !isStudentMode;
        
        // Save state
        sessionStorage.setItem('studentMode', isStudentMode);
        
        // Update button appearance
        if (isStudentMode) {
            studentModeBtn.classList.add('active');
            studentModeBtn.setAttribute('aria-pressed', 'true');
            studentModeBtn.style.background = 'rgba(74, 108, 247, 0.8)';
            studentModeBtn.style.color = 'white';
            
            // Show success message
            showMessage('Student Mode Activated! Chemical structures will be shown on medicine details pages.', 'success');
        } else {
            studentModeBtn.classList.remove('active');
            studentModeBtn.setAttribute('aria-pressed', 'false');
            studentModeBtn.style.background = '';
            studentModeBtn.style.color = '';
            
            // Show info message
            showMessage('Student Mode Deactivated', 'info');
        }
        
        console.log('Student mode:', isStudentMode ? 'ON' : 'OFF');
    });

    // Simple message display function (without banner)
    function showMessage(message, type) {
        // Create a temporary toast notification
        const toast = document.createElement('div');
        toast.className = 'student-mode-toast';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : '#3b82f6'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
            font-size: 0.9rem;
            max-width: 300px;
        `;
        
        document.body.appendChild(toast);
        
        // Remove after 3 seconds
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }

    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
        
        .action-btn.student.active {
            background: rgba(74, 108, 247, 0.8) !important;
            color: white !important;
            border: 2px solid #4a6cf7 !important;
        }
        
        body.dark-mode .action-btn.student.active {
            background: rgba(74, 108, 247, 0.9) !important;
            color: white !important;
            border: 2px solid #6b8afd !important;
            box-shadow: 0 0 20px rgba(74, 108, 247, 0.5);
        }
    `;
    document.head.appendChild(style);
    
    console.log('Student mode initialized');
});
