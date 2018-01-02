var Promise       = require('promise');
var logger        = require('winston');

function SendMailHelper(nodemailer) {
  return {
    options: {},

    send: function(mailOptions) {
      var self = this;


      return new Promise(function (resolve, reject) {
        try {
          logger.log('info', '[SendMailHelper] connecting to the mail server', self.options);
          var transporter = nodemailer.createTransport(self.options);

          logger.log('debug', '[SendMailHelper] transporter: %s', transporter);

          mailOptions.from = self.options.from.name +
                             '<' + self.options.from.email + '>';

          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
               logger.log('error', '[SendMailHelper] An error has ocurred while the settings were made', error);
              reject(error);
            } else {
               logger.log('info', '[SendMailHelper] The email has been sent successfully');
              resolve(info);
            }
          });
        } catch (e) {
          reject(e);
        }
      });
    }
  };
}

module.exports = SendMailHelper;
