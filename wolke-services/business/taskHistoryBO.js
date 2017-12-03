var logger          = require('winston');
var model           = require('../models/taskHistory')();
var Promise         = require('promise');

module.exports = function() {
  return {
    clear: function() {
      return new Promise(function(resolve, reject) {
        model.remove({}, function(err) {
          if (err) {
            logger.log('error', 'An error has occurred while deleting all history', error);
            reject(err);
          } else {
            logger.log('info', 'The history have been deleted succesfully');
            resolve();
          }
        });
      });
    },

    getAll: function(serverId, taskId) {
      return new Promise(function(resolve, reject) {
        logger.log('info', 'Getting history from database');

        var filter = {};

        if (serverId) {
          filter.serverId = serverId;
          logger.log('debug', 'A serverId parameter was set', serverId);
        }
        if (taskId) {
          filter.taskId = taskId;
          logger.log('debug', 'A taskId parameter was set', taskId);
        }

        model.find(filter)
          .exec()
          .then(function(items) {
            logger.log('info', '%d history were returned', items.length);
            resolve(items);
          }).catch(function(erro) {
            logger.log('error', 'An error has ocurred while getting history from database', erro);
            reject(erro);
          });
      });
    },

    save: function(entity) {
      return new Promise(function(resolve, reject) {
        logger.log('info', 'Creating a new task history', entity);

        model.create(entity)
        .then(function(item) {
          logger.log('info', 'The task history has been created succesfully');
          resolve(item);
        }).catch(function(erro) {
          logger.log('error', 'An error has ocurred while creating a new task history', erro);
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
        logger.log('info', 'Deleting the task history by ', query);

        model.remove(query)
        .then(function() {
          logger.log('info', 'The tasks history has been deleted succesfully by', query);
          resolve();
        })
        .catch(function(erro) {
          logger.log('error', 'An error has occurred while deleting a task history by ',
          query,
          erro);
          reject(erro);
        });
      });
    }
  };
};
