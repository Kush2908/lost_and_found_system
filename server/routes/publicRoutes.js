const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const Location = require('../models/Location');

router.get('/categories', async (req, res) => {
  try {
    const categories = await Category.find({ active: true }).sort({ name: 1 });
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/locations', async (req, res) => {
  try {
    const locations = await Location.find({ active: true }).sort({ name: 1 });
    res.json(locations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
