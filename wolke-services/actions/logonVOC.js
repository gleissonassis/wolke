var Promise = require('promise');
var request = require('request');

module.exports = function() {
  return {
    run: function(options) {
      return new Promise(function(resolve, reject) {
        var opt = {
           uri: 'https://iam.sa-brazil-1.telefonicaopencloud.com/v3/auth/tokens',
           method: 'POST',
           headers:{
             'Content-Type': 'application/json',
           },
           json: {
            auth: {
              identity: {
                methods: ['password'],
                password: {
                  user: {
                    name: options.user,
                    password: options.password,
                    domain: {
                      name: options.domainName
                    }
                  }
                }
              },
              scope: {
                project: {
                  name: options.projectName
                }
              }
            }
          }
         };

         request(opt, function (error, response, body) {
           if (error || (response && response.statusCode !== 201)) {
             var e = error ? error : response;
             reject(e);
           } else {
             resolve({
               token: response.headers['x-subject-token'],
               projectId: body.token.project.id
              });
           }
         });
      });
    }
  };
};
