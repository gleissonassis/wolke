var logger              = require('winston');
var model               = require('../models/server')();
var Promise             = require('promise');

module.exports = function(templateBO, taskBO, taskHistoryBO) {
  return {
    clear: function() {
      return new Promise(function(resolve, reject) {
        model.remove({}, function(err) {
          if (err) {
            logger.log('error', 'An error has occurred while deleting all servers', error);
            reject(err);
          } else {
            logger.log('info', 'The server have been deleted succesfully');
            resolve();
          }
        });
      });
    },

    getAll: function() {
      return new Promise(function(resolve, reject) {
        logger.log('info', 'Getting servers from database');

        /*var filter = {};

        if (type) {
          filter.type = type;
          logger.log('debug', 'A type querystring parameter was set', type);
        }*/

        model.find()
          .exec()
          .then(function(items) {
            logger.log('info', '%d servers were returned', items.length);
            resolve(items);
          }).catch(function(erro) {
            logger.log('error', 'An error has ocurred while getting servers from database', erro);
            reject(erro);
          });
      });
    },

    updateTaskScheduling: function(entity) {
      return new Promise(function(resolve, reject) {
        logger.log('info', 'Clearing the tasks linked to server id %s', entity._id);

        taskBO.deleteByServerId(entity._id.toString())
          .then(function(){
            return templateBO.getById(entity.templateId);
          })
          .then(function(template){
            if (template) {
              var p = [];

              logger.log('info', 'The template was found. Creating the tasks...');

              for (var i = 0; i < template.schedule.length; i++) {
                var schedule = template.schedule[i];

                p.push(taskBO.save({
                  description: 'Peform the action ' + schedule.command + ' on server ' + entity.name,
                  minute: schedule.minute,
                  hour: schedule.hour,
                  day: schedule.weekday,
                  month: '*',
                  year: '*',
                  serverId: entity._id,
                  templateId: entity.templateId,
                  command: schedule.command + ';' + entity._id,
                }));
              }

              logger.log('info', 'All promises was triggered');

              return Promise.all(p);
            } else {
              reject('Can not find the template by id ' + entity.templateId);
            }
          })
          .then(resolve)
          .catch(reject);
      });
    },

    saveEntity: function(entity) {
      return new Promise(function(resolve, reject) {
        logger.log('info', 'Creating a new server', entity);

        model.create(entity)
        .then(function(item) {
          logger.log('info', 'The server has been created succesfully');
          resolve(item);
        }).catch(function(erro) {
          logger.log('error', 'An error has ocurred while creating a new server', erro);
          reject(erro);
        });
      });
    },

    save: function(entity) {
      var self = this;
      var rEntity = null;

      return new Promise(function(resolve, reject) {
        self.saveEntity(entity)
          .then(function(newEntity) {
            rEntity = newEntity;
            return self.updateTaskScheduling(newEntity);
          })
          .then(function(){
            resolve(rEntity);
          })
          .catch(reject);
      });
    },

    updateEntity: function(entity) {
      return new Promise(function(resolve, reject) {
        logger.log('info', 'Update a server');

        model.findByIdAndUpdate(entity._id, entity, {'new': true})
        .then(function(item) {
          logger.log('info', 'The server has been updated succesfully');
          resolve(item);
        }).catch(function(erro) {
          logger.log('error', 'An error has ocurred while updating a server', erro);
          reject(erro);
        });
      });
    },

    update: function(entity) {
      var self = this;
      var rEntity = null;

      return new Promise(function(resolve, reject) {
        self.updateEntity(entity)
          .then(function(newEntity) {
            rEntity = newEntity;
            return self.updateTaskScheduling(newEntity);
          })
          .then(function(){
            resolve(rEntity);
          })
          .catch(reject);
      });
    },

    getById: function(id) {
      return new Promise(function(resolve, reject) {
        logger.log('info', 'Getting a server by id %s', id);

        model.findById(id)
        .then(function(entity) {
          if (!entity) {
            resolve(null);
            logger.log('info', 'server not found');
          } else {
            resolve(entity);
            logger.log('info', 'The server was found');
          }
        }).catch(function(erro) {
            logger.log('error', 'An error has occurred while geeting a server by id %s', id, erro);
            reject(erro);
        });
      });
    },

    delete: function(id) {
      return new Promise(function(resolve, reject) {

        logger.log('info', 'Deleting the all task history linked to server id %s', id);
        taskHistoryBO.deleteByServerId(id)
          .then(function(){
            logger.log('info', 'Deleting the tasks linked to server id %s', id);
            return taskBO.deleteByServerId(id);
          })
          .then(function() {
            logger.log('info', 'Deleting the server by id %s', id);
            model.remove({'_id': id})
              .then(function() {
                logger.log('info', 'The server has been deleted succesfully');
                resolve();
              })
              .catch(function(erro) {
                logger.log('error', 'An error has occurred while deleting a server by id %s', id, erro);
                reject(erro);
              });
          })
          .catch(function(error) {
            logger.log('error', 'An error has occurred while deleting a server by id %s 1', id, erro);
            reject(error);
          });
      });
    }
  };
};
