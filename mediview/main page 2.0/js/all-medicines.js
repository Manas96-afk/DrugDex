// All Medicines Modal Functionality
document.addEventListener('DOMContentLoaded', function() {
    const allMedicinesBtn = document.getElementById('allMedicinesBtn');
    const allMedicinesModal = document.getElementById('allMedicinesModal');
    const medicinesList = document.getElementById('medicinesList');
    const filterInput = document.getElementById('medicineFilterInput');
    const categoryFilter = document.getElementById('categoryFilter');
    
    let allMedicines = [];

    // Sample medicine data (will be replaced with actual API data)
    const sampleMedicines = [
        { name: 'Paracetamol', company: 'Various', strength: '500mg', category: 'pain-relief', price: 25 },
        { name: 'Ibuprofen', company: 'Various', strength: '400mg', category: 'pain-relief', price: 35 },
        { name: 'Amoxicillin', company: 'Various', strength: '250mg', category: 'antibiotic', price: 120 },
        { name: 'Azithromycin', company: 'Various', strength: '500mg', category: 'antibiotic', price: 180 },
        { name: 'Omeprazole', company: 'Various', strength: '20mg', category: 'antacid', price: 85 },
        { name: 'Cetirizine', company: 'Various', strength: '10mg', category: 'allergy', price: 45 },
        { name: 'Metformin', company: 'Various', strength: '500mg', category: 'diabetes', price: 95 },
        { name: 'Atorvastatin', company: 'Various', strength: '20mg', category: 'cardiovascular', price: 150 },
        { name: 'Aspirin', company: 'Bayer', strength: '75mg', category: 'pain-relief', price: 15 },
        { name: 'Diclofenac', company: 'Novartis', strength: '50mg', category: 'pain-relief', price: 45 },
        { name: 'Ciprofloxacin', company: 'Various', strength: '500mg', category: 'antibiotic', price: 95 },
        { name: 'Pantoprazole', company: 'Various', strength: '40mg', category: 'antacid', price: 95 },
        { name: 'Amlodipine', company: 'Pfizer', strength: '5mg', category: 'cardiovascular', price: 45 },
        { name: 'Salbutamol', company: 'GSK', strength: '4mg', category: 'respiratory', price: 35 },
        { name: 'Loratadine', company: 'Various', strength: '10mg', category: 'allergy', price: 40 }
    ];

    // Open modal
    if (allMedicinesBtn) {
        allMedicinesBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Opening all medicines modal');
            
            if (allMedicinesModal) {
                allMedicinesModal.style.display = 'block';
                allMedicinesModal.classList.add('show');
                document.body.classList.add('modal-open');
                document.body.style.overflow = 'hidden';
                
                // Load medicines after a small delay to ensure modal is visible
                setTimeout(() => {
                    loadMedicines();
                }, 100);
            } else {
                console.error('All medicines modal not found');
            }
        });
    } else {
        console.error('All medicines button not found');
    }

    // Close modal function
    window.closeAllMedicinesModal = function() {
        console.log('Closing all medicines modal');
        
        if (allMedicinesModal) {
            allMedicinesModal.classList.remove('show');
            document.body.classList.remove('modal-open');
            
            setTimeout(() => {
                allMedicinesModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }, 300);
        }
    };

    // Close on outside click
    if (allMedicinesModal) {
        allMedicinesModal.addEventListener('click', function(e) {
            if (e.target === allMedicinesModal) {
                closeAllMedicinesModal();
            }
        });
    }

    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && allMedicinesModal.style.display === 'block') {
            closeAllMedicinesModal();
        }
    });

    // Load medicines
    function loadMedicines() {
        // Try to fetch from API, fallback to sample data
        fetch('/api/medicines')
            .then(response => response.json())
            .then(data => {
                allMedicines = data;
                displayMedicines(allMedicines);
            })
            .catch(error => {
                console.log('Using sample data');
                allMedicines = sampleMedicines;
                displayMedicines(allMedicines);
            });
    }

    // Display medicines
    function displayMedicines(medicines) {
        if (medicines.length === 0) {
            medicinesList.innerHTML = `
                <div class="no-medicines">
                    <i class="fas fa-pills"></i>
                    <p>No medicines found</p>
                </div>
            `;
            return;
        }

        medicinesList.innerHTML = medicines.map(medicine => `
            <div class="medicine-item" onclick="viewMedicineDetails('${medicine.id || medicine.name}')">
                <div class="medicine-item-header">
                    <h3 class="medicine-name">${medicine.name}</h3>
                    <span class="medicine-strength">${medicine.strength}</span>
                </div>
                <p class="medicine-company">
                    <i class="fas fa-building"></i> ${medicine.company || medicine.manufacturer || 'Various'}
                </p>
                <span class="medicine-category">
                    <i class="fas fa-tag"></i> ${formatCategory(medicine.category || medicine.type)}
                </span>
            </div>
        `).join('');
    }

    // Format category name
    function formatCategory(category) {
        return category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }

    // Filter medicines
    function filterMedicines() {
        const searchTerm = filterInput.value.toLowerCase();
        const selectedCategory = categoryFilter.value;

        const filtered = allMedicines.filter(medicine => {
            const matchesSearch = medicine.name.toLowerCase().includes(searchTerm) ||
                                (medicine.company && medicine.company.toLowerCase().includes(searchTerm)) ||
                                (medicine.manufacturer && medicine.manufacturer.toLowerCase().includes(searchTerm));
            
            const matchesCategory = selectedCategory === 'all' || 
                                  medicine.category === selectedCategory ||
                                  medicine.type === selectedCategory;

            return matchesSearch && matchesCategory;
        });

        displayMedicines(filtered);
    }

    // Add event listeners for filters
    if (filterInput) {
        filterInput.addEventListener('input', filterMedicines);
    }

    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterMedicines);
    }

    // View medicine details
    window.viewMedicineDetails = function(medicineId) {
        // Store medicine data and navigate to details page
        const medicine = allMedicines.find(m => m.id === medicineId || m.name === medicineId);
        if (medicine) {
            sessionStorage.setItem('currentMedicine', JSON.stringify(medicine));
            window.location.href = 'medicine-details.html';
        }
    };

    console.log('All medicines modal initialized');
});
