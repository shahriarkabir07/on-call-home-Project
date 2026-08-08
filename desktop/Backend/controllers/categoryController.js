const db = require('../config/db');

// Get all service categories
exports.getAllCategories = async (req, res) => {
  try {
    const [categories] = await db.query('SELECT * FROM service_categories ORDER BY id ASC');
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Create a new category
exports.createCategory = async (req, res) => {
  const { name, description, icon } = req.body;

  if (!name) {
    return res.status(400).json({ success: false, message: 'Category name is required' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO service_categories (name, description, icon) VALUES (?, ?, ?)',
      [name, description || '', icon || 'default-icon']
    );

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      categoryId: result.insertId
    });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};