document.addEventListener('DOMContentLoaded', function() {
    const imageUpload = document.getElementById('imageUpload');
    const imagePreview = document.getElementById('imagePreview');
    const previewImage = document.getElementById('previewImage');
    const removeImageBtn = document.querySelector('.remove-image');
    const uploadBtn = document.querySelector('.upload-btn');
    const searchSubmitBtn = document.querySelector('.search-submit-btn');
    const searchInput = document.getElementById('medicineSearch');

    // Handle image selection
    if (imageUpload) {
        imageUpload.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                // Check if file is an image
                if (!file.type.match('image.*')) {
                    showError('Please select a valid image file (JPEG, PNG, or WebP)');
                    return;
                }

                // Check file size (max 5MB)
                if (file.size > 5 * 1024 * 1024) {
                    showError('Image size should be less than 5MB');
                    return;
                }

                // Show preview
                const reader = new FileReader();
                reader.onload = function(e) {
                    previewImage.src = e.target.result;
                    imagePreview.style.display = 'flex';
                    uploadBtn.style.visibility = 'hidden';
                    
                    // Enable search button when image is selected
                    if (searchSubmitBtn) {
                        searchSubmitBtn.disabled = false;
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Handle remove image button
    if (removeImageBtn) {
        removeImageBtn.addEventListener('click', function() {
            imagePreview.style.display = 'none';
            uploadBtn.style.visibility = 'visible';
            imageUpload.value = '';
            
            // Disable search button when no image is selected
            if (searchSubmitBtn) {
                searchSubmitBtn.disabled = true;
            }
        });
    }

    // Handle search form submission
    if (searchSubmitBtn) {
        searchSubmitBtn.addEventListener('click', function(e) {
            if (imageUpload.files.length === 0) {
                e.preventDefault();
                showError('Please select an image to search');
                return;
            }

            // Here you would typically send the image to your server for processing
            // For now, we'll just log it to the console
            console.log('Searching with image:', imageUpload.files[0]);
            
            // Show loading state
            const loadingElement = document.getElementById('modelLoading');
            if (loadingElement) {
                loadingElement.style.display = 'block';
            }
            
            // Simulate API call
            setTimeout(() => {
                if (loadingElement) {
                    loadingElement.style.display = 'none';
                }
                // Show results or error message
                showError('Image search functionality will be implemented here');
            }, 2000);
        });
    }

    // Show error message
    function showError(message) {
        // Remove any existing error messages
        const existingError = document.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        // Create and show new error message
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.style.color = '#e74c3c';
        errorElement.style.marginTop = '10px';
        errorElement.style.padding = '8px 12px';
        errorElement.style.backgroundColor = '#fde8e8';
        errorElement.style.borderRadius = '4px';
        errorElement.style.fontSize = '14px';
        errorElement.textContent = message;

        const searchSection = document.querySelector('.search-section');
        if (searchSection) {
            searchSection.appendChild(errorElement);
            
            // Auto-remove error after 5 seconds
            setTimeout(() => {
                errorElement.remove();
            }, 5000);
        }
    }
});
