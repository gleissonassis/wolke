var request               = require('supertest');
var chai                  = require('chai');
var expect                = chai.expect;
var TemplateBO            = require('../../../business/templateBO');

describe('server', function(){
  var server;
  var bo = new TemplateBO();

  var valid = {
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
    return bo.clear();
  });

  after(function(){
    return bo.clear().then(function(){
      server.close();
    });
  });

  describe('/v1/templates', function(){
    it('should return a empty array', function() {
      return request(server)
        .get('/v1/templates')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200).
        then(function(res) {
          expect(res.body.length).to.be.equal(0);
        });
    });

    it('should store a valid template', function() {
      var _id = null;
      return request(server)
        .post('/v1/templates')
        .send(valid)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(201)
        .then(function(res){
          console.log(res.body);
          expect(res.body.__v).to.be.equal(0);
          expect(res.body).to.have.property('_id');
          expect(res.body.name).to.be.equal('Padrão');
          expect(res.body.schedule[0].weekday).to.be.equal(0);
          expect(res.body.schedule[0].minute).to.be.equal(2);
          expect(res.body.schedule[0].hour).to.be.equal(18);
          expect(res.body.schedule[0].command).to.be.equal('turnon-server');
          expect(res.body.schedule[1].weekday).to.be.equal(0);
          expect(res.body.schedule[1].minute).to.be.equal(2);
          expect(res.body.schedule[1].hour).to.be.equal(20);
          expect(res.body.schedule[1].command).to.be.equal('turnoff-server');

          _id = res.body._id;

          return request(server)
            .get('/v1/templates/' + _id)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200);
        }).then(function(res){
          expect(res.body._id).to.be.equal(_id);
          expect(res.body.name).to.be.equal('Padrão');
          expect(res.body.schedule[0].weekday).to.be.equal(0);
          expect(res.body.schedule[0].minute).to.be.equal(2);
          expect(res.body.schedule[0].hour).to.be.equal(18);
          expect(res.body.schedule[0].command).to.be.equal('turnon-server');
          expect(res.body.schedule[1].weekday).to.be.equal(0);
          expect(res.body.schedule[1].minute).to.be.equal(2);
          expect(res.body.schedule[1].hour).to.be.equal(20);
          expect(res.body.schedule[1].command).to.be.equal('turnoff-server');
        });
    });

    it('should return 404 for an invalid template id', function() {
      return request(server)
        .get('/v1/templates/null')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(404);
    });

    it('should return 404 for an unknown template id', function() {
      return request(server)
        .get('/v1/templates/59ef944ecf01e60c59679c13')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(404);
    });

    it('should update a valid workflow', function() {
      return request(server)
        .get('/v1/templates')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .then(function(res){
          expect(res.body.length).to.be.equal(1);

          var entity = res.body[0];

          entity.name = 'NOVO NOME';
          entity.schedule[0].weekday = 1;

          return request(server)
            .put('/v1/templates/' + entity._id)
            .send(entity)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(function(res){
              expect(res.body.name).to.be.equal('NOVO NOME');
              expect(res.body.schedule[0].weekday).to.be.equal(1);
            });
        });
    });

    it('should remove a valid workflow', function() {
      return request(server)
        .get('/v1/templates')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .then(function(res){
          expect(res.body.length).to.be.equal(1);
          var entity = res.body[0];

          return request(server)
            .delete('/v1/templates/' + entity._id)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200);
        }).then(function(){
          return request(server)
            .get('/v1/templates')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200);
        }).then(function(res){
          expect(res.body.length).to.be.equal(0);
        });
    });

    it('should return 404 trying remove a invalid template', function() {
      return request(server)
        .delete('/v1/templates/null')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(404);
    });
  });
});
