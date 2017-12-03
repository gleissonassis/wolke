var logger          = require('winston');
var model           = require('../models/template')();
var Promise         = require('promise');

module.exports = function() {
  return {
    clear: function() {
      return new Promise(function(resolve, reject) {
        model.remove({}, function(err) {
          if (err) {
            logger.log('error', 'An error has occurred while deleting all templates', error);
            reject(err);
          } else {
            logger.log('info', 'The templates have been deleted succesfully');
            resolve();
          }
        });
      });
    },

    getAll: function() {
      return new Promise(function(resolve, reject) {
        logger.log('info', 'Getting templates from database');

        /*var filter = {};

        if (type) {
          filter.type = type;
          logger.log('debug', 'A type querystring parameter was set', type);
        }*/

        model.find()
          .exec()
          .then(function(items) {
            logger.log('info', '%d templates were returned', items.length);
            resolve(items);
          }).catch(function(erro) {
            logger.log('error', 'An error has ocurred while getting templates from database', erro);
            reject(erro);
          });
      });
    },

    save: function(entity) {
      return new Promise(function(resolve, reject) {
        logger.log('info', 'Creating a new template', entity);

        model.create(entity)
        .then(function(item) {
          logger.log('info', 'The template has been created succesfully');
          resolve(item);
        }).catch(function(erro) {
          logger.log('error', 'An error has ocurred while creating a new template', erro);
          reject(erro);
        });
      });
    },

    update: function(entity) {
      return new Promise(function(resolve, reject) {
        logger.log('info', 'Update a template');

        model.findByIdAndUpdate(entity._id, entity, {'new': true})
        .then(function(item) {
          logger.log('info', 'The template has been updated succesfully');
          resolve(item);
        }).catch(function(erro) {
          logger.log('error', 'An error has ocurred while updating a template', erro);
          reject(erro);
        });
      });
    },

    getById: function(id) {
      return new Promise(function(resolve, reject) {
        logger.log('info', 'Getting a template by id %s', id);

        model.findById(id)
        .lean()
        .then(function(entity) {
          if (!entity) {
            resolve(null);
            logger.log('info', 'Template not found');
          } else {
            console.log('aaaaa', entity);
            resolve(entity);
            logger.log('info', 'The template was found');
          }
        }).catch(function(erro) {
            logger.log('error', 'An error has occurred while geeting a template by id %s', id, erro);
            reject(erro);
        });
      });
    },

    delete: function(id) {
      return new Promise(function(resolve, reject) {
        logger.log('info', 'Deleting the template by id %s', id);

        model.remove({'_id': id})
        .then(function() {
          logger.log('info', 'The template has been deleted succesfully');
          resolve();
        })
        .catch(function(erro) {
          logger.log('error', 'An error has occurred while deleting a template by id %s 1', id, erro);
          reject(erro);
        });
      });
    }
  };
};
