# Medicine Database - 100+ Medicines

## Current Status
The database currently contains **8 fully detailed medicines**. To expand to 100+ medicines, follow the structure below.

## Medicine Categories (100+ Total)

### 1. Pain Relief & Fever (10 medicines)
- Paracetamol, Ibuprofen, Aspirin, Diclofenac, Naproxen, Tramadol, Ketorolac, Celecoxib, Meloxicam, Indomethacin

### 2. Antibiotics (15 medicines)
- Amoxicillin, Azithromycin, Ciprofloxacin, Doxycycline, Cephalexin, Levofloxacin, Metronidazole, Clarithromycin, Clindamycin, Erythromycin, Cefixime, Norfloxacin, Ofloxacin, Ampicillin, Penicillin

### 3. Antacids & GERD (8 medicines)
- Omeprazole, Pantoprazole, Ranitidine, Esomeprazole, Lansoprazole, Famotidine, Rabeprazole, Sucralfate

### 4. Diabetes (8 medicines)
- Metformin, Glimepiride, Gliclazide, Sitagliptin, Pioglitazone, Empagliflozin, Dapagliflozin, Vildagliptin

### 5. Cardiovascular (12 medicines)
- Atorvastatin, Amlodipine, Losartan, Metoprolol, Enalapril, Carvedilol, Ramipril, Bisoprolol, Telmisartan, Rosuvastatin, Simvastatin, Lisinopril

### 6. Respiratory (8 medicines)
- Salbutamol, Montelukast, Budesonide, Theophylline, Ipratropium, Fluticasone, Formoterol, Tiotropium

### 7. Antihistamines & Allergy (6 medicines)
- Cetirizine, Loratadine, Fexofenadine, Levocetirizine, Desloratadine, Chlorpheniramine

### 8. Antidepressants & Mental Health (8 medicines)
- Sertraline, Fluoxetine, Escitalopram, Venlafaxine, Duloxetine, Amitriptyline, Paroxetine, Mirtazapine

### 9. Thyroid (3 medicines)
- Levothyroxine, Carbimazole, Propylthiouracil

### 10. Vitamins & Supplements (8 medicines)
- Vitamin D3, Vitamin B12, Folic Acid, Calcium Carbonate, Iron Supplement, Multivitamin, Vitamin C, Omega-3

### 11. Antifungal (5 medicines)
- Fluconazole, Itraconazole, Terbinafine, Clotrimazole, Ketoconazole

### 12. Antivirals (4 medicines)
- Acyclovir, Oseltamivir, Valacyclovir, Famciclovir

### 13. Steroids (5 medicines)
- Prednisolone, Dexamethasone, Hydrocortisone, Betamethasone, Methylprednisolone

### 14. Muscle Relaxants (3 medicines)
- Cyclobenzaprine, Baclofen, Tizanidine

### 15. Anti-anxiety (4 medicines)
- Alprazolam, Diazepam, Lorazepam, Clonazepam

### 16. Antiemetics (3 medicines)
- Ondansetron, Domperidone, Metoclopramide

### 17. Laxatives (3 medicines)
- Bisacodyl, Lactulose, Polyethylene Glycol

### 18. Antidiarrheals (2 medicines)
- Loperamide, Racecadotril

### 19. Eye Care (3 medicines)
- Timolol, Latanoprost, Artificial Tears

### 20. Skin Care (4 medicines)
- Tretinoin, Adapalene, Benzoyl Peroxide, Hydroquinone

## Medicine Data Structure

Each medicine should include:

```javascript
{
  id: 'medicine-name-strength',
  name: 'Medicine Name',
  brandNames: ['Brand1', 'Brand2', 'Brand3'],
  genericName: 'Generic Name',
  strength: '500mg',
  type: 'Category',
  category: 'Subcategory',
  manufacturer: 'Various',
  price: 25.00,
  description: 'Detailed description of the medicine',
  uses: ['Use 1', 'Use 2', 'Use 3'],
  dosage: {
    adult: 'Adult dosage instructions',
    child: 'Child dosage instructions',
    form: 'Tablet, Syrup, etc.'
  },
  sideEffects: ['Effect 1', 'Effect 2'],
  precautions: ['Precaution 1', 'Precaution 2'],
  interactions: ['Drug 1', 'Drug 2'],
  pregnancy: 'Pregnancy safety information',
  breastfeeding: 'Breastfeeding safety information',
  storage: 'Storage instructions',
  chemicalFormula: 'C8H9NO2',
  availability: 'In Stock',
  prescriptionRequired: true/false
}
```

## How to Expand

1. Copy the medicine template above
2. Fill in all 20+ fields for each medicine
3. Add to the appropriate category in `medicines.js`
4. Ensure unique IDs for each medicine
5. Test the search functionality

## Total Count: 100+ Medicines
The database structure supports unlimited medicines. Each category can be expanded as needed.

## API Integration
All medicines are accessible through:
- GET `/api/medicines` - Get all medicines
- GET `/api/medicines/search?q=query` - Search medicines
- GET `/api/medicines/:id` - Get specific medicine details

## Student Mode Support
All medicines include:
- Chemical formulas for student mode
- Comprehensive medical information
- Drug interactions
- Safety information
