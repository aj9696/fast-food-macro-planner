// src/models/MenuItem.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const menuItemSchema = new Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  calories: Number,
  protein: Number,
  carbs: Number,
  fat: Number,
});

module.exports = mongoose.model('MenuItem', menuItemSchema);
