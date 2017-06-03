var mongoose = require('mongoose');
var mongooseStringQuery = require('./lib/mongoose-string-query');

var monsterSchema = new mongoose.Schema({
  name: String,
  monster_identification_no: Number,
  monster_object_id: mongoose.Schema.ObjectId,
  eats_humans: Boolean,
  foods: [ new mongoose.Schema({
    name: String,
    vegetarian: Boolean,
    calories: Number
  })],
  loc: Array,
  data: {}
});

monsterSchema.plugin(mongooseStringQuery);

module.exports = mongoose.model('Monster', monsterSchema);