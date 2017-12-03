var mongoose = require('mongoose');
var mongooseSchema =  mongoose.Schema;

var model = null;

module.exports = function(){
  var schema = mongooseSchema({
    name: {
      type: String,
      required:true,
      unique: true,
      index: true
    },
    templateId: {
      type: String
    },
    serverId: {
      type: String,
      required:true,
    },
    isOnline: {
      type: Boolean
    }
  });

  model = model ? model : mongoose.model('servers', schema);

  return model;
};
