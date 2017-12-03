module.exports = function(app) {
  var controller = app.controllers.task;
  var taskHistoryController = app.controllers.taskHistory;

  app.route('/v1/tasks')
    .get(controller.getAll)
    .post(controller.save);

  console.log(controller.getEligibleTasks);

  app.route('/v1/tasks/eligibles')
    .get(controller.getEligibleTasks);

  app.route('/v1/tasks/:id')
    .get(controller.getById)
    .put(controller.update)
    .delete(controller.delete);

  app.route('/v1/tasks/:taskId/history')
    .get(taskHistoryController.getAll);
};
