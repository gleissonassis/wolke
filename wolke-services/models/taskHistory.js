var mongoose = require('mongoose');
var mongooseSchema =  mongoose.Schema;

var model = null;

module.exports = function(){
  var schema = mongooseSchema({
    taskId: {
      type: String,
      required: true
    },
    serverId: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    status: {
      type: Number,
      required: true
    },
    info: {
      type: String,
      required: true
    },
    details: {
      type: mongoose.Schema.Types.Object,
      required: true
    }
  });

  model = model ? model : mongoose.model('taskshistory', schema);

  return model;
};
