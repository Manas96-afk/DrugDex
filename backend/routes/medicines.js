const express = require('express');
const router = express.Router();
const medicines = require('../data/medicines');

// Search medicines with improved fuzzy matching
router.get('/search', (req, res) => {
  try {
    const { q, limit = 10 } = req.query;
    
    if (!q || q.trim().length === 0) {
      return res.json([]);
    }

    const searchTerm = q.toLowerCase().trim();
    const searchTerms = searchTerm.split(' ').filter(term => term.length > 0);

    // Score-based search for better relevance
    const results = medicines.map(medicine => {
      let score = 0;
      const medicineName = medicine.name.toLowerCase();
      const genericName = medicine.genericName.toLowerCase();
      const brandNames = medicine.brandNames.map(b => b.toLowerCase());
      const category = medicine.category.toLowerCase();
      const uses = medicine.uses.map(u => u.toLowerCase());

      searchTerms.forEach(term => {
        // Exact name match (highest priority)
        if (medicineName === term) score += 100;
        else if (medicineName.startsWith(term)) score += 50;
        else if (medicineName.includes(term)) score += 30;

        // Generic name match
        if (genericName === term) score += 90;
        else if (genericName.includes(term)) score += 25;

        // Brand name match
        brandNames.forEach(brand => {
          if (brand === term) score += 80;
          else if (brand.startsWith(term)) score += 40;
          else if (brand.includes(term)) score += 20;
        });

        // Category match
        if (category.includes(term)) score += 15;

        // Uses match
        uses.forEach(use => {
          if (use.includes(term)) score += 10;
        });
      });

      return { ...medicine, score };
    })
    .filter(medicine => medicine.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, parseInt(limit));

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all medicines
router.get('/', (req, res) => {
  try {
    const { category, type, prescriptionRequired } = req.query;
    
    let filtered = medicines;

    if (category) {
      filtered = filtered.filter(m => 
        m.category.toLowerCase().includes(category.toLowerCase())
      );
    }

    if (type) {
      filtered = filtered.filter(m => 
        m.type.toLowerCase().includes(type.toLowerCase())
      );
    }

    if (prescriptionRequired !== undefined) {
      const required = prescriptionRequired === 'true';
      filtered = filtered.filter(m => m.prescriptionRequired === required);
    }

    res.json(filtered);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get medicine by ID
router.get('/:id', (req, res) => {
  try {
    const medicine = medicines.find(m => m.id === req.params.id);
    
    if (!medicine) {
      return res.status(404).json({ error: 'Medicine not found' });
    }

    res.json(medicine);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get medicine suggestions (autocomplete)
router.get('/suggest/autocomplete', (req, res) => {
  try {
    const { q, limit = 5 } = req.query;
    
    if (!q || q.trim().length < 2) {
      return res.json([]);
    }

    const searchTerm = q.toLowerCase().trim();

    const suggestions = medicines
      .filter(medicine => {
        const name = medicine.name.toLowerCase();
        const brandNames = medicine.brandNames.map(b => b.toLowerCase());
        const genericName = medicine.genericName.toLowerCase();
        
        return name.startsWith(searchTerm) || 
               brandNames.some(b => b.startsWith(searchTerm)) ||
               genericName.startsWith(searchTerm);
      })
      .slice(0, parseInt(limit))
      .map(medicine => ({
        id: medicine.id,
        name: medicine.name,
        brandNames: medicine.brandNames,
        type: medicine.type,
        strength: medicine.strength,
        icon: 'fa-pills'
      }));

    res.json(suggestions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get similar medicines
router.get('/:id/similar', (req, res) => {
  try {
    const medicine = medicines.find(m => m.id === req.params.id);
    
    if (!medicine) {
      return res.status(404).json({ error: 'Medicine not found' });
    }

    const similar = medicines
      .filter(m => 
        m.id !== medicine.id && 
        (m.category === medicine.category || m.type === medicine.type)
      )
      .slice(0, 6)
      .map(m => ({
        id: m.id,
        name: m.name,
        brandNames: m.brandNames,
        type: m.type,
        strength: m.strength,
        price: m.price
      }));

    res.json(similar);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get medicine alternatives (generic/cheaper options)
router.get('/:id/alternatives', (req, res) => {
  try {
    const medicine = medicines.find(m => m.id === req.params.id);
    
    if (!medicine) {
      return res.status(404).json({ error: 'Medicine not found' });
    }

    const alternatives = medicines
      .filter(m => 
        m.id !== medicine.id && 
        (m.genericName === medicine.genericName || 
         m.category === medicine.category)
      )
      .map(m => ({
        id: m.id,
        name: m.name,
        brandNames: m.brandNames,
        type: m.type,
        strength: m.strength,
        price: m.price,
        savings: medicine.price - m.price,
        isGeneric: m.name === m.genericName
      }))
      .sort((a, b) => a.price - b.price);

    res.json(alternatives);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
