// src/controllers/recommendationController.js
const MenuItem = require('../models/MenuItem');

/**
 * POST /api/recommendations
 * Body example:
 * {
 *   "desiredCalories": 600,
 *   "desiredProtein": 40,
 *   "desiredCarbs": 50,
 *   "desiredFat": 20,
 *   "brands": ["BrandA", "BrandB"]
 * }
 */
exports.getRecommendations = async (req, res) => {
  try {
    const { desiredCalories, desiredProtein, desiredCarbs, desiredFat, brands } = req.body;

    // Basic filter: items that have calories <= desiredCalories + some margin, etc.
    // This is very simplistic; you can improve it to do more sophisticated matching.
    const filter = {};
    if (brands && brands.length) {
      filter.brand = { $in: brands };
    }

    // Fetch menu items from DB
    const menuItems = await MenuItem.find(filter);

    // Example: rank each item by how close it is to the user’s macros
    // For demonstration, we’ll do a naive approach
    const scoredItems = menuItems.map(item => {
      // Calculate some score based on difference from desired macros
      const calDiff = Math.abs((item.calories || 0) - desiredCalories);
      const proteinDiff = Math.abs((item.protein || 0) - desiredProtein);
      const carbsDiff = Math.abs((item.carbs || 0) - desiredCarbs);
      const fatDiff = Math.abs((item.fat || 0) - desiredFat);

      // Weighted sum (this is arbitrary)
      const totalDiff = calDiff + proteinDiff * 10 + carbsDiff * 5 + fatDiff * 5;
      return { ...item.toObject(), score: totalDiff };
    });

    // Sort by ascending "score" (least difference is best)
    scoredItems.sort((a, b) => a.score - b.score);

    res.json(scoredItems);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
