module.exports = function(app) {
    var controller = app.controllers.action;

    app.route('/v1/actions')
      .post(controller.runAction);
};
