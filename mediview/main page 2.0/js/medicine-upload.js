document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const uploadBtn = document.getElementById('uploadBtn');
    const fileInput = document.getElementById('medicineImageUpload');
    const modal = document.getElementById('medicineModal');
    const closeBtn = document.querySelector('.close');
    const uploadedImage = document.getElementById('uploadedMedicineImage');
    
    // Function to find medicine by image (in a real app, this would use image recognition)
    function findMedicineByImage(imageFile) {
        // For demo purposes, we'll return the first medicine
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(window.medicines[0]); // Return first medicine as example
            }, 1000);
        });
    }

    // Open file input when upload button is clicked
    uploadBtn.addEventListener('click', () => {
        fileInput.click();
    });

    // Handle file selection
    fileInput.addEventListener('change', handleFileSelect);

    // Close modal when clicking the close button
    closeBtn.addEventListener('click', closeModal);

    // Close modal when clicking outside the modal content
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });


    function handleFileSelect(event) {
        const file = event.target.files[0];
        if (!file) return;

        // Check if the file is an image
        if (!file.type.match('image.*')) {
            alert('Please select an image file (JPEG, PNG, etc.)');
            return;
        }

        // Show loading state (you can add a loading spinner)
        showLoading(true);


        // In a real app, you would upload the image to a server for processing
        // For this example, we'll just display the selected image
        const reader = new FileReader();
        
        reader.onload = function(e) {
            // Display the uploaded image
            uploadedImage.src = e.target.result;
            
            // Find medicine by image (in a real app, this would use image recognition)
            findMedicineByImage(file)
                .then(medicine => {
                    if (medicine) {
                        // Store medicine in session storage and redirect
                        sessionStorage.setItem('currentMedicine', JSON.stringify(medicine));
                        window.location.href = 'medicine-details.html';
                    } else {
                        alert('Medicine not recognized. Please try again or search manually.');
                    }
                    showLoading(false);
                })
                .catch(error => {
                    console.error('Error processing image:', error);
                    alert('Error processing image. Please try again.');
                    showLoading(false);
                });
        };
        
        reader.onerror = function() {
            alert('Error reading the file');
            showLoading(false);
        };
        
        reader.readAsDataURL(file);
    }

    function showMedicineDetails(medicine) {
        document.getElementById('medicineName').textContent = medicine.name;
        document.getElementById('medicineUses').textContent = medicine.uses;
        document.getElementById('medicineDosage').textContent = medicine.dosage;
        document.getElementById('medicineSideEffects').textContent = medicine.sideEffects;
        document.getElementById('medicinePrecautions').textContent = medicine.precautions;
        document.getElementById('medicineCategory').textContent = medicine.category;
        
        // Show the modal
        modal.style.display = 'block';
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
    }

    function closeModal() {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
            // Reset the file input
            fileInput.value = '';
        }, 300);
    }


    function showLoading(show) {
        // You can add a loading spinner here if needed
        if (show) {
            console.log('Loading...');
        } else {
            console.log('Loading complete');
        }
    }
});
