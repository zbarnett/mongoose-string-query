var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  name: String,
  monster_identification_no: Number,
  eats_humans: Boolean,
  foods: [ new mongoose.Schema({
    name: String,
    vegetarian: Boolean,
    calories: Number
  })]

});

module.exports = DB.model('Monster', schema);