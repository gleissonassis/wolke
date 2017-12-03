module.exports = function(app) {
  var controller = app.controllers.server;
  var taskHistoryController = app.controllers.taskHistory;

  app.route('/v1/servers')
    .get(controller.getAll)
    .post(controller.save);

  app.route('/v1/servers/:id')
    .get(controller.getById)
    .put(controller.update)
    .delete(controller.delete);

  app.route('/v1/servers/:serverId/history')
    .get(taskHistoryController.getAll);
};
