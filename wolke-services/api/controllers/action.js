var actionBuilder   = require('../../actions/actionBuilder')();
var logger          = require('winston');
var settings        = require('../../config/settings');

module.exports = function() {
  return {
    runAction: function(req, res) {
      logger.log('info', 'Starting process to run action %s - %s', req.body.action, req.body.serverId);

      logger.log('info', 'Getting an action based on task name logon-voc');
      var logonVOC = actionBuilder.getAction('logon-voc');

      logger.log('info', 'Getting an action based on action %s', req.body.action);
      var action = actionBuilder.getAction(req.body.action);

      logonVOC.run(settings.voc)
        .then(function(r) {
          return action.run({
            token: r.token,
            projectId: r.projectId,
            serverId: req.body.serverId
          });
        })
        .then(function(r) {
          logger.log('info', 'Action return', typeof r);
          res.status(200).json(r);
        })
        .catch(function(r) {
          logger.log('error', 'Action return', typeof r);
          res.status(500).json(r);
        });
    }
  };
};
