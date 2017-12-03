module.exports = function(app) {
    var controller = app.controllers.template;

    app.route('/v1/templates')
      .get(controller.getAll)
      .post(controller.save);

    app.route('/v1/templates/:id')
      .get(controller.getById)
      .put(controller.update)
      .delete(controller.delete);
};
