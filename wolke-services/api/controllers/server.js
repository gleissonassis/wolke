var TemplateBO          = require('../../business/templateBO');
var TaskBO              = require('../../business/taskBO');
var TaskHistoryBO       = require('../../business/taskHistoryBO');
var ServerBO            = require('../../business/serverBO');

module.exports = function() {
  var business = new ServerBO(
    new TemplateBO(),
    new TaskBO(),
    new TaskHistoryBO()
  );

  return {
    getAll: function(req, res) {
      business.getAll(req.query.type).then(function(items) {
        res.status(200).json(items);
        }, function(error) {
        res.status(500).json(error);
      });
    },

    save: function(req, res) {
      business.save(req.body).then(function(r) {
        res.status(201).json(r);
        }, function(error) {
          console.log(error);
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
        })
        .catch(function(error) {
          res.status(404).json(error);
        });
    },

    delete: function(req, res) {
      business.delete(req.params.id).then(function() {
          res.status(200).json();
        })
      .catch(function(error) {
          res.status(404).json(error);
        });
      }
    };
};
