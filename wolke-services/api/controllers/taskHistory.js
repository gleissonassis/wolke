var logger      = require('winston');
var business    = require('../../business/taskHistoryBO')();

module.exports = function() {
  return {
    getAll: function(req, res) {
      business.getAll(req.params.serverId, req.params.taskId).then(function(items) {
        res.status(200).json(items);
        }, function(error) {
        logger.log('error', 'An error has occurred executing the route ', req.url, error);
        res.status(500).json(error);
      });
    }
  };
};
