var request = require('request');

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
             'os-stop': {
               type : 'SOFT'
             }
           }
         };

        request(options, function (error, response, body) {
           if (error) {
             reject(error);
           } else if (response.statusCode !== 202) {
             reject(body);
           } else {
             resolve(body);
           }
         });
      });
    }
  };
};
