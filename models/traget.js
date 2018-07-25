var mongoose = require('mongoose');
var DateOnly = require('mongoose-dateonly')(mongoose);
var Schema = mongoose.Schema;

var tragetSchema = new Schema ({
  nom : {type: String, required: true},
  prenom : {type: String, required: true},
  depart : {type: String, required: true},
  etape : {type: String, require: false},
  dest : {type: String, required: true},
  allezDate : {type: String, required: true},
  retourDate : {type: String, required: true},
  places : {type: Number, required: false, default:4},
  email: {type: String, required: false},
  num: {type: Number},
  facebook: {type: String, required: false}
});

module.exports = mongoose.model('traget', tragetSchema);
