var mongoose    = require('mongoose');
var appSettings = require('./settings');
var Promise     = require('promise');

module.exports = function(){
  mongoose.connect(appSettings.mongoUrl, {useMongoClient: true});
  mongoose.Promise = Promise;
  mongoose.set('debug', appSettings.isMongoDebug);

  mongoose.connection.on('connected', function() {
    console.log('Mongoose! Connected at ' + appSettings.mongoUrl);
  });

  mongoose.connection.on('disconnected', function() {
    console.log('Mongoose! Disconnected em ' + appSettings.mongoUrl);
  });

  mongoose.connection.on('error', function(erro) {
    console.log('Mongoose! Error : ' + erro);
  });

  process.on('SIGINT', function() {
    mongoose.connection.close(function() {
      console.log('Mongoose! Disconnected by the application');
      process.exit(0);
    });
  });
};
