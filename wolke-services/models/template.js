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
    schedule:  [
      {
        weekday: {
          type: Number,
          required:true,
        },
        minute: {
          type: Number,
          required:true,
        },
        hour: {
          type: Number,
          required:true,
        },
        command: {
          type: String,
          required:true,
        }
      }
    ]
  });

  model = model ? model : mongoose.model('templates', schema);
  return model;
};
