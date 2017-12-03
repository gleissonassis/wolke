var request               = require('supertest');
var chai                  = require('chai');
var expect                = chai.expect;
var ServerBO              = require('../../../business/serverBO');
var TemplateBO            = require('../../../business/templateBO');
var taskHistoryBO         = require('../../../business/taskHistoryBO')();

describe('server', function(){
  var server;
  var bo = new ServerBO();
  var templateBO = new TemplateBO();

  var valid = {
    name: 'Padrão',
    templateId: 'ID',
    serverId: 'SERVER_ID',
    isOnline: true
  };

  var validTemplate = {
    name: 'Padrão',
    schedule: [
      {
        weekday: 0,
        minute: 2,
        hour: 18,
        command: 'turnon-server'
      },
      {
        weekday: 0,
        minute: 2,
        hour: 20,
        command: 'turnoff-server'
      }
    ]
  };

  before(function(){
    server = require('../../../server');
    return bo.clear()
      .then(function(){
        return templateBO.clear();
      })
      .then(function(){
        return taskHistoryBO.clear();
      });
  });

  after(function(){
    return bo.clear()
      .then(function(){
        return templateBO.clear();
      })
      .then(function(){
        return taskHistoryBO.clear();
      })
      .then(function(){
        server.close();
      });
  });

  describe('/v1/servers', function(){
    it('should return a empty array', function() {
      return request(server)
        .get('/v1/servers')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200).
        then(function(res) {
          expect(res.body.length).to.be.equal(0);
        });
    });

    it('should store a valid server', function() {
      var _id = null;
      var _idTemplate = null;
      return request(server)
        .post('/v1/templates')
        .send(validTemplate)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(201)
        .then(function(res){
          _idTemplate = res.body._id;

          expect(res.body.__v).to.be.equal(0);
          expect(res.body).to.have.property('_id');
          expect(res.body.name).to.be.equal('Padrão');
          expect(res.body.schedule[0].weekday).to.be.equal(0);
          expect(res.body.schedule[0].minute).to.be.equal(2);
          expect(res.body.schedule[0].hour).to.be.equal(18);
          expect(res.body.schedule[0].command).to.be.equal('turnon-server');

          valid.templateId = _idTemplate;

          return request(server)
            .post('/v1/servers')
            .send(valid)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(201);
        }).then(function(res){
          console.log(res.body);
          expect(res.body.__v).to.be.equal(0);
          expect(res.body).to.have.property('_id');
          expect(res.body.name).to.be.equal('Padrão');
          expect(res.body.templateId).to.be.equal(_idTemplate);
          expect(res.body.isOnline).to.be.equal(true);

          _id = res.body._id;

          return request(server)
            .get('/v1/servers/' + _id)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200);
        }).then(function(res){
          expect(res.body.name).to.be.equal('Padrão');
          expect(res.body.templateId).to.be.equal(_idTemplate);
          expect(res.body.isOnline).to.be.equal(true);
        });
    });

    it('should return 404 for an invalid server id', function() {
      return request(server)
        .get('/v1/servers/null')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(404);
    });

    it('should return 404 for an unknown server id', function() {
      return request(server)
        .get('/v1/servers/59ef944ecf01e60c59679c13')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(404);
    });

    it('should update a valid server', function() {
      return request(server)
        .get('/v1/servers')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .then(function(res){
          expect(res.body.length).to.be.equal(1);

          var entity = res.body[0];

          entity.name = 'NOVO NOME';
          entity.isOnline = false;

          return request(server)
            .put('/v1/servers/' + entity._id)
            .send(entity)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(function(res){
            expect(res.body.name).to.be.equal('NOVO NOME');
            expect(res.body.isOnline).to.be.equal(false);
            });
        });
    });

    it('should return a history from a valid server', function() {
      var entity = null;
      return request(server)
        .get('/v1/servers')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .then(function(res){
          expect(res.body.length).to.be.equal(1);
          entity = res.body[0];

          var history = {
            taskId: 'TASKID',
            serverId: entity._id,
            date: new Date(),
            status: 1,
            info: 'INFO',
            details: {}
          };

          return taskHistoryBO.save(history);
        }).then(function(){
          return request(server)
            .get('/v1/servers/' + entity._id + '/history')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200);
        }).then(function(res){
          expect(res.body.length).to.be.equal(1);
          expect(res.body[0].taskId).to.be.equal('TASKID');
          expect(res.body[0].serverId).to.be.equal(entity._id);
          expect(res.body[0].status).to.be.equal(1);
          expect(res.body[0].info).to.be.equal('INFO');
        });
    });

    it('should remove a valid server', function() {
      return request(server)
        .get('/v1/servers')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .then(function(res){
          expect(res.body.length).to.be.equal(1);
          var entity = res.body[0];

          return request(server)
            .delete('/v1/servers/' + entity._id)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200);
        }).then(function(){
          return request(server)
            .get('/v1/servers')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200);
        }).then(function(res){
          expect(res.body.length).to.be.equal(0);
        });
    });

    it('should return 404 trying remove a invalid server', function() {
      return request(server)
        .delete('/v1/servers/null')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(404);
    });
  });
});
