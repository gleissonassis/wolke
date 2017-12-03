var logger          = require('winston');
var ActionBuilder   = require('./actions/actionBuilder');
var TaskHistoryBO   = require('./business/taskHistoryBO');
var TaskBO          = require('./business/taskBO');
                      require('./config/database.js')();

module.exports = function() {
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
        })
        .catch(function(r){
          logger.log('error', 'An error has occured. Ending the process to run eligible tasks process', r);
        });
      }, 1000 * 60);
    }
  };
};
