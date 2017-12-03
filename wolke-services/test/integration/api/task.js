var request               = require('supertest');
var chai                  = require('chai');
var expect                = chai.expect;
var bo                    = require('../../../business/taskBO')();
var taskHistoryBO         = require('../../../business/taskHistoryBO')();

describe('server', function(){
  var server;

  var valid = {
    description: 'DESCRIPTION',
    minute: '*',
    hour: '*',
    day: '*',
    month: '*',
    year: '*',
    serverId: 'VMID',
    command: 'COMMAND',
  };

  before(function(){
    server = require('../../../server');
    return bo.clear()
      .then(function(){
        return taskHistoryBO.clear();
      });
  });

  after(function(){
    return bo.clear()
      .then(function(){
        return taskHistoryBO.clear();
      })
      .then(function(){
        server.close();
      });
  });

  describe('/v1/tasks', function(){
    it('should return a empty array', function() {
      return request(server)
        .get('/v1/tasks')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200).
        then(function(res) {
          expect(res.body.length).to.be.equal(0);
        });
    });

    it('should store a valid task', function() {
      var _id = null;
      return request(server)
        .post('/v1/tasks')
        .send(valid)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(201)
        .then(function(res){
          console.log(res.body);
          expect(res.body.__v).to.be.equal(0);
          expect(res.body).to.have.property('_id');
          expect(res.body.description).to.be.equal('DESCRIPTION');
          expect(res.body.serverId).to.be.equal('VMID');
          expect(res.body.command).to.be.equal('COMMAND');

          _id = res.body._id;

          return request(server)
            .get('/v1/tasks/' + _id)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200);
        }).then(function(res){
          expect(res.body._id).to.be.equal(_id);
          expect(res.body.description).to.be.equal('DESCRIPTION');
          expect(res.body.serverId).to.be.equal('VMID');
          expect(res.body.command).to.be.equal('COMMAND');
        });
    });

    it('should return 404 for an invalid vm id', function() {
      return request(server)
        .get('/v1/tasks/null')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(404);
    });

    it('should return 404 for an unknown task id', function() {
      return request(server)
        .get('/v1/tasks/59ef944ecf01e60c59679c13')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(404);
    });

    it('should update a valid task', function() {
      return request(server)
        .get('/v1/tasks')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .then(function(res){
          expect(res.body.length).to.be.equal(1);

          var entity = res.body[0];

          entity.description = 'NEW_DESCRIPTION';

          return request(server)
            .put('/v1/tasks/' + entity._id)
            .send(entity)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(function(res){
              expect(res.body.description).to.be.equal('NEW_DESCRIPTION');
            });
        });
    });

    it('should return a history from a valid task', function() {
      var entity = null;
      return request(server)
        .get('/v1/tasks')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .then(function(res){
          expect(res.body.length).to.be.equal(1);
          entity = res.body[0];

          var history = {
            taskId: entity._id,
            serverId: entity.serverId,
            date: new Date(),
            status: 1,
            info: 'INFO',
            details: {}
          };

          return taskHistoryBO.save(history);
        }).then(function(){
          return request(server)
            .get('/v1/tasks/' + entity._id + '/history')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200);
        }).then(function(res){
          expect(res.body.length).to.be.equal(1);
          expect(res.body[0].taskId).to.be.equal(entity._id);
          expect(res.body[0].serverId).to.be.equal(entity.serverId);
          expect(res.body[0].status).to.be.equal(1);
          expect(res.body[0].info).to.be.equal('INFO');
        });
    });

    it('should remove a valid task', function() {
      return request(server)
        .get('/v1/tasks')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .then(function(res){
          expect(res.body.length).to.be.equal(1);
          var entity = res.body[0];

          return request(server)
            .delete('/v1/tasks/' + entity._id)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200);
        }).then(function(){
          return request(server)
            .get('/v1/tasks')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200);
        }).then(function(res){
          expect(res.body.length).to.be.equal(0);
        });
    });

    it('should return 404 trying remove a invalid task', function() {
      return request(server)
        .delete('/v1/tasks/null')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(404);
    });
  });
});
