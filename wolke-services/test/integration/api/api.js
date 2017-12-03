var request               = require('supertest');
var chai                  = require('chai');
var expect                = chai.expect;

describe('server', function(){
  var server;

  before(function(){
    server = require('../../../server');
  });

  after(function(){
    server.close();
  });

  describe('/v1/api', function(){
    it('should be functional', function(done) {
      request(server)
        .get('/v1/api')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, function(err, res) {
          expect(res.body).to.deep.equal({
            version: '1.0.0.0',
            status: 'Is everything working fine! All the robots are saying that, we trust them.'
          });
          done();
        });
    });
  });
});
