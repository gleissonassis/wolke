var ListServersAction = require('./listServersAction');
var LogonVOC = require('./logonVOC');
var TurnonServerAction = require('./turnonServerAction');
var TurnoffServerAction = require('./turnoffServerAction');

module.exports = function() {
  return {
    getAction: function(actionName) {
      switch (actionName) {
        case 'logon-voc':
          return new LogonVOC();
        case 'turnon-server':
          return new TurnonServerAction();
        case 'turnoff-server':
          return new TurnoffServerAction();
        case 'list-servers':
          return new ListServersAction();
        default:
          return null;
      }
    }
  };
};
