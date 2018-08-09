const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ReserverSchema = new Schema ({
  proposer: {type: String, required: true},
  reserver: {type: String, required: true}
});

module.exports = mongoose.model('reserver',ReserverSchema);
