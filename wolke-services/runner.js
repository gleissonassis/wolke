var logger          = require('winston');
var ActionBuilder   = require('./actions/actionBuilder');
var TaskHistoryBO   = require('./business/taskHistoryBO');
var TaskBO          = require('./business/taskBO');
var SendMailHelper  = require('./helpers/sendMailHelper');
var settings        = require('./config/settings');
var nodemailer      = require('nodemailer');
                      require('./config/database.js')();

module.exports = function() {
  var sendMailHelper = new SendMailHelper(nodemailer);
  sendMailHelper.options = settings.mailOptions;

  return {
    run: function(){
      var taskBO = new TaskBO(
        new TaskHistoryBO(),
        new ActionBuilder()
      );

      setInterval(function() {
        var referenceDate = new Date();

        logger.log('info', 'Starting the process to run eligible tasks in ', referenceDate);

        taskBO.runEligibleTasks(referenceDate)
        .then(function(r) {
          logger.log('info', 'Ending the process to run eligible tasks process', r);

          if (r.length) {
            var errors = r.filter(function(item) {
              return item.status === 0;
            });

            if (errors.length) {
              var html = 'Hi, <p>The following tasks has failed:</p><ul>';

              errors.forEach(function(error) {
                html += '<li>' +
                        error.description +
                        '<xmp>' +
                        JSON.stringify(error.details) +
                        '</xmp>' +
                        '</li>';
              });

              html += '</ul><p><b>Wolke</b>';

              return sendMailHelper.send({
                to: settings.mailOptions.to,
                subject: '[WOLKE] An error has occured while processing scheduled tasks',
                html: html
              });
            }
          }
        })
        .catch(function(r){
          logger.log('error', 'An error has occured. Ending the process to run eligible tasks process', r);
        });
      }, 1000 * 60);
    }
  };
};
