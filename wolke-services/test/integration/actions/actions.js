var logonVOC              = require('../../../actions/logonVOC')();
var turnonServerAction    = require('../../../actions/turnonServerAction')();
var turnoffServerAction   = require('../../../actions/turnoffServerAction')();
var settings              = require('../../../config/settings');

describe('actions', function(){
  describe('machine', function(){
    it('should turn on a server', function() {
      return logonVOC.run(settings.voc)
        .then(function(r) {
          return turnonServerAction.run({
            token: r.token,
            projectId: r.projectId,
            serverId: '1cabfe30-cd87-41fd-aebc-afac5294fbbe'
          });
        });
    });

    it('should turn off a server', function() {
      return logonVOC.run(settings.voc)
        .then(function(r) {
          return turnoffServerAction.run({
            token: r.token,
            projectId: r.projectId,
            serverId: '1cabfe30-cd87-41fd-aebc-afac5294fbbe'
          });
        });
    });
  });
});
