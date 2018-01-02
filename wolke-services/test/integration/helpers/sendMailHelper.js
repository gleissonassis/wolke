var settings              = require('../../../config/settings');
var SendMailHelper        = require('../../../helpers/SendMailHelper');
var nodemailer            = require('nodemailer');

describe('helpers', function(){
  describe('sendMailHelper', function(){
    it('should send an email', function() {
      var sendMailHelper = new SendMailHelper(nodemailer);
      sendMailHelper.options = settings.mailOptions;

      return sendMailHelper.send({
        to: 'gleisson.assis@gmail.com',
        subject: 'Hello ✔', // Subject line
        text: 'Hello world?', // plain text body
        html: '<b>Hello world?</b>' // html body
      });
    });
  });
});
