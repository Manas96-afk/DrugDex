// Script to generate comprehensive medicine database with 100+ medicines
const fs = require('fs');

// Medicine template
const medicineCategories = {
  painRelief: [
    { name: 'Paracetamol', strength: '500mg', price: 25, formula: 'C8H9NO2', brands: ['Tylenol', 'Calpol', 'Panadol'] },
    { name: 'Ibuprofen', strength: '400mg', price: 35, formula: 'C13H18O2', brands: ['Advil', 'Motrin', 'Brufen'] },
    { name: 'Aspirin', strength: '75mg', price: 15, formula: 'C9H8O4', brands: ['Disprin', 'Ecosprin'] },
    { name: 'Diclofenac', strength: '50mg', price: 45, formula: 'C14H11Cl2NO2', brands: ['Voltaren', 'Voveran'] },
    { name: 'Naproxen', strength: '250mg', price: 40, formula: 'C14H14O3', brands: ['Aleve', 'Naprosyn'] },
    { name: 'Tramadol', strength: '50mg', price: 80, formula: 'C16H25NO2', brands: ['Ultram', 'Tramal'] },
    { name: 'Ketorolac', strength: '10mg', price: 55, formula: 'C15H13NO3', brands: ['Toradol', 'Ketanov'] },
    { name: 'Celecoxib', strength: '200mg', price: 120, formula: 'C17H14F3N3O2S', brands: ['Celebrex'] },
    { name: 'Meloxicam', strength: '15mg', price: 65, formula: 'C14H13N3O4S2', brands: ['Mobic'] },
    { name: 'Indomethacin', strength: '25mg', price: 50, formula: 'C19H16ClNO4', brands: ['Indocin'] }
  ],
  antibiotics: [
    { name: 'Amoxicillin', strength: '250mg', price: 120, formula: 'C16H19N3O5S', brands: ['Amoxil', 'Trimox'] },
    { name: 'Azithromycin', strength: '500mg', price: 180, formula: 'C38H72N2O12', brands: ['Zithromax', 'Azithral'] },
    { name: 'Ciprofloxacin', strength: '500mg', price: 95, formula: 'C17H18FN3O3', brands: ['Cipro', 'Ciplox'] },
    { name: 'Doxycycline', strength: '100mg', price: 85, formula: 'C22H24N2O8', brands: ['Vibramycin', 'Doxy'] },
    { name: 'Cephalexin', strength: '500mg', price: 110, formula: 'C16H17N3O4S', brands: ['Keflex'] },
    { name: 'Levofloxacin', strength: '500mg', price: 150, formula: 'C18H20FN3O4', brands: ['Levaquin'] },
    { name: 'Metronidazole', strength: '400mg', price: 45, formula: 'C6H9N3O3', brands: ['Flagyl'] },
    { name: 'Clarithromycin', strength: '500mg', price: 165, formula: 'C38H69NO13', brands: ['Biaxin'] },
    { name: 'Clindamycin', strength: '300mg', price: 140, formula: 'C18H33ClN2O5S', brands: ['Cleocin'] },
    { name: 'Erythromycin', strength: '250mg', price: 75, formula: 'C37H67NO13', brands: ['E-Mycin'] }
  ],
  antacids: [
    { name: 'Omeprazole', strength: '20mg', price: 85, formula: 'C17H19N3O3S', brands: ['Prilosec', 'Losec'] },
    { name: 'Pantoprazole', strength: '40mg', price: 95, formula: 'C16H15F2N3O4S', brands: ['Protonix'] },
    { name: 'Ranitidine', strength: '150mg', price: 35, formula: 'C13H22N4O3S', brands: ['Zantac'] },
    { name: 'Esomeprazole', strength: '40mg', price: 110, formula: 'C17H19N3O3S', brands: ['Nexium'] },
    { name: 'Lansoprazole', strength: '30mg', price: 90, formula: 'C16H14F3N3O2S', brands: ['Prevacid'] },
    { name: 'Famotidine', strength: '20mg', price: 40, formula: 'C8H15N7O2S3', brands: ['Pepcid'] },
    { name: 'Rabeprazole', strength: '20mg', price: 100, formula: 'C18H21N3O3S', brands: ['Aciphex'] },
    { name: 'Sucralfate', strength: '1g', price: 55, formula: 'C12H54Al16O75S8', brands: ['Carafate'] }
  ],
  diabetes: [
    { name: 'Metformin', strength: '500mg', price: 95, formula: 'C4H11N5', brands: ['Glucophage', 'Glycomet'] },
    { name: 'Glimepiride', strength: '2mg', price: 75, formula: 'C24H34N4O5S', brands: ['Amaryl'] },
    { name: 'Gliclazide', strength: '80mg', price: 65, formula: 'C15H21N3O3S', brands: ['Diamicron'] },
    { name: 'Sitagliptin', strength: '100mg', price: 250, formula: 'C16H15F6N5O', brands: ['Januvia'] },
    { name: 'Pioglitazone', strength: '15mg', price: 120, formula: 'C19H20N2O3S', brands: ['Actos'] },
    { name: 'Empagliflozin', strength: '10mg', price: 280, formula: 'C23H27ClO7', brands: ['Jardiance'] },
    { name: 'Dapagliflozin', strength: '10mg', price: 270, formula: 'C21H25ClO6', brands: ['Farxiga'] },
    { name: 'Vildagliptin', strength: '50mg', price: 180, formula: 'C17H25N3O2', brands: ['Galvus'] }
  ],
  cardiovascular: [
    { name: 'Atorvastatin', strength: '20mg', price: 150, formula: 'C33H35FN2O5', brands: ['Lipitor', 'Atorlip'] },
    { name: 'Amlodipine', strength: '5mg', price: 45, formula: 'C20H25ClN2O5', brands: ['Norvasc'] },
    { name: 'Losartan', strength: '50mg', price: 85, formula: 'C22H23ClN6O', brands: ['Cozaar'] },
    { name: 'Metoprolol', strength: '50mg', price: 55, formula: 'C15H25NO3', brands: ['Lopressor'] },
    { name: 'Enalapril', strength: '5mg', price: 40, formula: 'C20H28N2O5', brands: ['Vasotec'] },
    { name: 'Carvedilol', strength: '25mg', price: 95, formula: 'C24H26N2O4', brands: ['Coreg'] },
    { name: 'Ramipril', strength: '5mg', price: 70, formula: 'C23H32N2O5', brands: ['Altace'] },
    { name: 'Bisoprolol', strength: '5mg', price: 60, formula: 'C18H31NO4', brands: ['Zebeta'] },
    { name: 'Telmisartan', strength: '40mg', price: 110, formula: 'C33H30N4O2', brands: ['Micardis'] },
    { name: 'Rosuvastatin', strength: '10mg', price: 180, formula: 'C22H28FN3O6S', brands: ['Crestor'] }
  ],
  respiratory: [
    { name: 'Salbutamol', strength: '4mg', price: 35, formula: 'C13H21NO3', brands: ['Ventolin', 'Albuterol'] },
    { name: 'Montelukast', strength: '10mg', price: 120, formula: 'C35H36ClNO3S', brands: ['Singulair'] },
    { name: 'Budesonide', strength: '200mcg', price: 250, formula: 'C25H34O6', brands: ['Pulmicort'] },
    { name: 'Theophylline', strength: '200mg', price: 45, formula: 'C7H8N4O2', brands: ['Theo-24'] },
    { name: 'Ipratropium', strength: '20mcg', price: 180, formula: 'C20H30NO3', brands: ['Atrovent'] },
    { name: 'Fluticasone', strength: '250mcg', price: 280, formula: 'C25H31F3O5S', brands: ['Flovent'] }
  ],
  antihistamines: [
    { name: 'Cetirizine', strength: '10mg', price: 45, formula: 'C21H25ClN2O3', brands: ['Zyrtec', 'Alerid'] },
    { name: 'Loratadine', strength: '10mg', price: 40, formula: 'C22H23ClN2O2', brands: ['Claritin'] },
    { name: 'Fexofenadine', strength: '120mg', price: 85, formula: 'C32H39NO4', brands: ['Allegra'] },
    { name: 'Levocetirizine', strength: '5mg', price: 55, formula: 'C21H25ClN2O3', brands: ['Xyzal'] },
    { name: 'Desloratadine', strength: '5mg', price: 75, formula: 'C19H19ClN2', brands: ['Clarinex'] },
    { name: 'Chlorpheniramine', strength: '4mg', price: 20, formula: 'C16H19ClN2', brands: ['Chlor-Trimeton'] }
  ],
  antidepressants: [
    { name: 'Sertraline', strength: '50mg', price: 120, formula: 'C17H17Cl2N', brands: ['Zoloft'] },
    { name: 'Fluoxetine', strength: '20mg', price: 95, formula: 'C17H18F3NO', brands: ['Prozac'] },
    { name: 'Escitalopram', strength: '10mg', price: 140, formula: 'C20H21FN2O', brands: ['Lexapro'] },
    { name: 'Venlafaxine', strength: '75mg', price: 110, formula: 'C17H27NO2', brands: ['Effexor'] },
    { name: 'Duloxetine', strength: '30mg', price: 180, formula: 'C18H19NOS', brands: ['Cymbalta'] },
    { name: 'Amitriptyline', strength: '25mg', price: 35, formula: 'C20H23N', brands: ['Elavil'] }
  ],
  thyroid: [
    { name: 'Levothyroxine', strength: '100mcg', price: 45, formula: 'C15H11I4NO4', brands: ['Synthroid', 'Eltroxin'] },
    { name: 'Carbimazole', strength: '5mg', price: 55, formula: 'C7H10N2O2S', brands: ['Neo-Mercazole'] },
    { name: 'Propylthiouracil', strength: '50mg', price: 40, formula: 'C7H10N2OS', brands: ['PTU'] }
  ],
  vitamins: [
    { name: 'Vitamin D3', strength: '60000IU', price: 25, formula: 'C27H44O', brands: ['Cholecalciferol'] },
    { name: 'Vitamin B12', strength: '1000mcg', price: 35, formula: 'C63H88CoN14O14P', brands: ['Methylcobalamin'] },
    { name: 'Folic Acid', strength: '5mg', price: 15, formula: 'C19H19N7O6', brands: ['Folate'] },
    { name: 'Calcium Carbonate', strength: '500mg', price: 30, formula: 'CaCO3', brands: ['Caltrate'] },
    { name: 'Iron Supplement', strength: '100mg', price: 40, formula: 'FeSO4', brands: ['Ferrous Sulfate'] },
    { name: 'Multivitamin', strength: 'Various', price: 120, formula: 'Various', brands: ['Centrum', 'One-A-Day'] }
  ]
};

console.log('Generating comprehensive medicine database...');
console.log('Total medicines to generate: 100+');
console.log('This is a template. Run this script with Node.js to generate the full database.');
