var util                = require('util');
var privateSettings     = require('./settings.private');

module.exports = {
    mongoUrl : util.format('mongodb://%s/%s',
                      process.env.DB_SERVER || 'localhost',
                      process.env.DB_NAME || 'wolke'),
    servicePort : process.env.PORT || 5000,
    isMongoDebug : true,
    voc: {
      user: privateSettings.voc.user,
      password: privateSettings.voc.password,
      domainName: privateSettings.voc.domainName,
      projectName: privateSettings.voc.projectName
    },
    mailOptions: {
      host: privateSettings.mailOptions.host,
      port: privateSettings.mailOptions.port,
      secure: privateSettings.mailOptions.secure,
      from: {
        email: privateSettings.mailOptions.from.email,
        name: privateSettings.mailOptions.from.name
      },
      to: privateSettings.mailOptions.to,
      tls: {
        rejectUnauthorized: privateSettings.mailOptions.tls.rejectUnauthorized
      }
    }
};
