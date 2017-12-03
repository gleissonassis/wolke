var TaskHistoryBO   = require('../../business/taskHistoryBO');
var ActionBuilder   = require('../../actions/actionBuilder');
var TaskBO          = require('../../business/taskBO');

module.exports = function() {
  var business = new TaskBO(
    new TaskHistoryBO(),
    new ActionBuilder()
  );

  return {
    getAll: function(req, res) {
      business.getAll(req.query.type).then(function(items) {
        res.status(200).json(items);
        }, function(error) {
        res.status(500).json(error);
      });
    },

    getEligibleTasks: function(req, res) {
      business.getEligibleTasks(new Date()).then(function(items) {
        res.status(200).json(items);
        }, function(error) {
        res.status(500).json(error);
      });
    },

    save: function(req, res) {
      business.save(req.body).then(function(r) {
        res.status(201).json(r);
        }, function(error) {
        res.status(422).json(error);
      });
    },

    update: function(req, res) {
      req.body._id = req.params.id;
      business.update(req.body).then(function(r) {
        res.status(200).json(r);
        }, function(error) {
        res.status(500).json(error);
      });
    },

    getById: function(req, res) {
      business.getById(req.params.id).then(function(item) {
          if (item) {
            res.status(200).json(item);
          } else {
            res.status(404).json({});
          }
        }, function(error) {
          res.status(404).json(error);
        });
    },

    delete: function(req, res) {
      business.delete(req.params.id).then(function() {
          res.status(200).json();
        }, function(error){
          res.status(404).json(error);
        });
      }
    };
};
