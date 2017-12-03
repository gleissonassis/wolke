var mongoose = require('mongoose');
var mongooseSchema =  mongoose.Schema;

var model = null;

module.exports = function(){
  var schema = mongooseSchema({
    description: {
      type: String,
      required: true,
    },
    minute: {
      type: String,
      required: true
    },
    hour: {
      type: String,
      required:true
    },
    day: {
      type: String,
      required:true
    },
    month: {
      type: String,
      required:true
    },
    year: {
      type: String,
      required:true
    },
    serverId: {
      type: String,
      required:true
    },
    templateId: {
      type: String
    },
    command: {
      type: String,
      required:true
    },
  });

  model = model ? model : mongoose.model('tasks', schema);

  return model;
};
