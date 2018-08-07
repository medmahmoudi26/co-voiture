const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema ({
  nom: {type: String, required: true},
  prenom: {type: String, required: true},
  pass: {type: String, required: true},
  email: {type: String, required:true, unique:true},
  year: {type: Number, required:true},
  number: {type: Number},
  facebook: {type: String}
});

module.exports = mongoose.model('user',UserSchema);
