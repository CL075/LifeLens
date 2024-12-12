const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
  date: String,
  mood: String,
  note: String,
  exercise: String,
  exerciseDetails: String,
  calories: String,
  amount: String,
  transactionType: String,
});

module.exports = mongoose.model('Record', recordSchema);
