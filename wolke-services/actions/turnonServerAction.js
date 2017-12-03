var request     = require('request');
var logger      = require('winston');

module.exports = function() {
  return {
    run: function(opt) {
      return new Promise(function(resolve, reject) {
        var options = {
           uri: 'https://ecs.sa-brazil-1.telefonicaopencloud.com/v2/' +
             opt.projectId +
             '/servers/' +
             opt.serverId +
             '/action',
           method: 'POST',
           headers:{
             'X-Auth-Token': opt.token,
             'Content-Type': 'application/json',
           },
           json: {
             'os-start': null
           }
         };

        logger.log('info', '[turon-server] Running the action turon-server', options);

        request(options, function (error, response, body) {
           if (error) {
             logger.log('info', '[turon-server] An error has occurred running the action', error);
             reject(error);
           } else if (response.statusCode !== 202) {
             logger.log('info', '[turon-server] An error has occurred running the action', body);
             reject(body);
           } else {
             logger.log('info', '[turon-server] The action has beed executed succesfully', body);
             resolve(body);
           }
         });
      });
    }
  };
};
