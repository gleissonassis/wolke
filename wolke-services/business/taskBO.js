var logger          = require('winston');
var model           = require('../models/task')();
var Promise         = require('promise');
var settings        = require('../config/settings');

module.exports = function(taskHistoryBO, actionBuilder) {
  return {
    clear: function() {
      return new Promise(function(resolve, reject) {
        model.remove({}, function(err) {
          if (err) {
            logger.log('error', 'An error has occurred while deleting all tasks', error);
            reject(err);
          } else {
            logger.log('info', 'The tasks have been deleted succesfully');
            resolve();
          }
        });
      });
    },

    getAll: function() {
      return new Promise(function(resolve, reject) {
        logger.log('info', 'Getting tasks from database');

        /*var filter = {};

        if (type) {
          filter.type = type;
          logger.log('debug', 'A type querystring parameter was set', type);
        }*/

        model.find()
          .exec()
          .then(function(items) {
            logger.log('info', '%d tasks were returned', items.length);
            resolve(items);
          }).catch(function(erro) {
            logger.log('error', 'An error has ocurred while getting tasks from database', erro);
            reject(erro);
          });
      });
    },

    getEligibleTasks: function(reference) {
      return new Promise(function(resolve, reject) {
        var filter = {
          $and :
            [
              {$or : [{minute : '*'}, {minute : reference.getMinutes()}]},
              {$or : [{hour : '*'}, {hour : reference.getHours()}]},
              {$or : [{day : '*'}, {day : reference.getDay()}]},
              {$or : [{month : '*'}, {month : reference.getMonth()}]},
              {$or : [{year : '*'}, {year : reference.getFullYear()}]},
            ]
        };

        logger.log('info', 'Getting eligible to run tasks from database', filter);

        model.find(filter)
          .exec()
          .then(function(items) {
            logger.log('info', '%d tasks were returned', items.length);
            resolve(items);
          }).catch(function(erro) {
            logger.log('error', 'An error has ocurred while getting tasks from database', erro);
            reject(erro);
          });
      });
    },

    save: function(entity) {
      return new Promise(function(resolve, reject) {
        logger.log('info', 'Creating a new task', entity);

        model.create(entity)
        .then(function(item) {
          logger.log('info', 'The task has been created succesfully');
          resolve(item);
        }).catch(function(erro) {
          logger.log('error', 'An error has ocurred while creating a new task', erro);
          reject(erro);
        });
      });
    },

    update: function(entity) {
      return new Promise(function(resolve, reject) {
        logger.log('info', 'Update a task');

        model.findByIdAndUpdate(entity._id, entity, {'new': true})
        .then(function(item) {
          logger.log('info', 'The task has been updated succesfully');
          resolve(item);
        }).catch(function(erro) {
          logger.log('error', 'An error has ocurred while updating a task', erro);
          reject(erro);
        });
      });
    },

    getById: function(id) {
      return new Promise(function(resolve, reject) {
        logger.log('info', 'Getting a task by id %s', id);

        model.findById(id)
        .then(function(entity) {
          if (!entity) {
            resolve(null);
            logger.log('info', 'Task not found');
          } else {
            resolve(entity);
            logger.log('info', 'The task was found');
          }
        }).catch(function(erro) {
            logger.log('error', 'An error has occurred while geeting a task by id %s', id, erro);
            reject(erro);
        });
      });
    },

    delete: function(id) {
      return new Promise(function(resolve, reject) {
        logger.log('info', 'Deleting the task by id %s', id);

        model.remove({'_id': id})
        .then(function() {
          logger.log('info', 'The task has been deleted succesfully');
          resolve();
        })
        .catch(function(erro) {
          logger.log('error', 'An error has occurred while deleting a task by id %s', id, erro);
          reject(erro);
        });
      });
    },

    deleteByServerId: function(serverId) {
      if (serverId) {
        return this.deleteByQuery({'serverId': serverId});
      } else {
        return Promise.resolve();
      }
    },

    deleteByQuery: function(query) {
      return new Promise(function(resolve, reject) {
        logger.log('info', 'Deleting the tasks by ', query);

        model.remove(query)
        .then(function() {
          logger.log('info', 'The tasks has been deleted succesfully by', query);
          resolve();
        })
        .catch(function(erro) {
          logger.log('error', 'An error has occurred while deleting a tasks by ',
          query,
          erro);
          reject(erro);
        });
      });
    },

    runEligibleTasks: function(reference) {
      var self = this;

      return new Promise(function(resolve, reject) {
        logger.log('info', 'Starting process to run eligible tasks to date ', reference);

        self.getEligibleTasks(reference)
          .then(function(tasks) {
            var p = [];

            logger.log('info', '%s tasks were eligible to run in the date %s', tasks.length, reference);

            for (var i = 0; i < tasks.length; i++) {
              p.push(self.runTask(tasks[i]));
            }

            logger.log('info', 'All promisses were set', reference);
            return Promise.all(p);
          })
          .then(function(r) {
            logger.log('info', 'All eligible tasks promisses were executed succesfully', r);
            resolve(r);
          })
          .catch(function(r) {
            logger.log('info', 'An error has occurred running the elible tasks to date ', reference, r);
            reject(r);
          });
      });
    },

    runTask: function(task) {
      return new Promise(function(resolve) {
        logger.log('info', 'Starting process to run task %s - %s', task._id, task.description);

        var commandArgs = task.command.split(';');
        logger.log('info', 'Task %s - command', task._id, task.command);

        logger.log('info', 'Task %s - Getting an action based on task name logon-voc', task._id);
        var logonVOC = actionBuilder.getAction('logon-voc');

        logger.log('info', 'Task %s - Getting an action based on task name %s', task._id, commandArgs[0]);
        var action = actionBuilder.getAction(commandArgs[0]);

        var history = null;

        logonVOC.run(settings.voc)
          .then(function(r) {
            return action.run({
              token: r.token,
              projectId: r.projectId,
              serverId: commandArgs[1]
            });
          })
          .then(function() {
            history = {
              taskId: task._id,
              serverId: task.serverId,
              date: new Date(),
              status: 1,
              info: 'The task has been executed succesfully',
              details: {}
            };

            logger.log('info', 'Task %s - The task has been executed succesfully', task._id);
            logger.log('info', 'Task %s - Saving task history', task._id, history);
            taskHistoryBO.save(history);

            logger.log('info', 'Task %s - Resolving the promise', task._id);
            resolve(history);
          })
          .catch(function(r) {
            history = {
              taskId: task._id,
              serverId: task.serverId,
              date: new Date(),
              status: 0,
              info: r.conflictingRequest.message,
              details: r
            };

            logger.log('info', 'Task %s - An error has occured running the task', task._id);
            logger.log('info', 'Task %s - Saving task history', task._id, history);
            taskHistoryBO.save(history);

            logger.log('info', 'Task %s - Resolving the promise', task._id);
            resolve(history);
          });
      });
    },
  };
};
