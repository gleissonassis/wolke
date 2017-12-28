var TemplateBO      = require('../../business/templateBO');
var TaskBO          = require('../../business/taskBO');
var TaskHistoryBO   = require('../../business/taskHistoryBO');
var ServerBO        = require('../../business/serverBO');
var chai            = require('chai');
var sinon           = require('sinon');
var expect          = chai.expect;

describe('business > ServerBO', function(){
  var templateBO = null,
      taskBO = null,
      taskHistoryBO = null,
      serverBO = null;

  beforeEach(function(done) {
    templateBO = new TemplateBO();
    taskBO = new TaskBO();
    taskHistoryBO = new TaskHistoryBO();
    serverBO = new ServerBO(templateBO, taskBO, taskHistoryBO);

    done();
  });

  it('should save a server', function() {
    var saveEntityStub = sinon.stub(serverBO, 'saveEntity');
    saveEntityStub
      .withArgs({
        'name': '<SERVER_NAME>',
        'templateId': '<TEMPLATE_ID>',
        'serverId': '<SERVER_VOC_ID>'
      })
      .returns(Promise.resolve({
        '_id': '<SERVER_ID>',
        'name': '<SERVER_NAME>',
        'templateId': '<TEMPLATE_ID>',
        'serverId': '<SERVER_VOC_ID>'
      }));

    var deleteByServerIdStub = sinon.stub(taskBO, 'deleteByServerId');
    deleteByServerIdStub
      .withArgs('<SERVER_ID>')
      .returns(Promise.resolve());

    var getByIdStub = sinon.stub(templateBO, 'getById');
    getByIdStub
      .withArgs('<TEMPLATE_ID>')
      .returns(Promise.resolve(
        {
          '_id': '5a2591dcf70a47001aefd87f',
          'name': 'Padrão',
          '__v': 0,
          'schedule': [
            {
              'weekday': 1,
              'command': 'turnon-server',
              'minute': 8,
              'hour': 0,
              '_id': '5a2591dcf70a47001aefd889'
            },
            {
              'weekday': 1,
              'command': 'turnoff-server',
              'minute': 18,
              'hour': 0,
              '_id': '5a2591dcf70a47001aefd888'
            }
          ]
        }
      ));

    var fakeTasks = [
      {
        description: 'Peform the action turnon-server on server <SERVER_NAME>',
        minute: 8,
        hour: 0,
        day: 1,
        month: '*',
        year: '*',
        serverId: '<SERVER_ID>',
        templateId: '<TEMPLATE_ID>',
        command: 'turnon-server;<SERVER_VOC_ID>',
      },
      {
        description: 'Peform the action turnoff-server on server <SERVER_NAME>',
        minute: 18,
        hour: 0,
        day: 1,
        month: '*',
        year: '*',
        serverId: '<SERVER_ID>',
        templateId: '<TEMPLATE_ID>',
        command: 'turnoff-server;<SERVER_VOC_ID>',
      }
    ];

    var saveMock = sinon.mock(taskBO);
    saveMock.expects('save').withArgs(fakeTasks[0]).returns(Promise.resolve());
    saveMock.expects('save').withArgs(fakeTasks[1]).returns(Promise.resolve());

    return serverBO.save({
        'name': '<SERVER_NAME>',
        'templateId': '<TEMPLATE_ID>',
        'serverId': '<SERVER_VOC_ID>'
      })
      .then(function(r) {
        saveMock.verify();
        expect(r.name).to.be.equal('<SERVER_NAME>');
        expect(r.templateId).to.be.equal('<TEMPLATE_ID>');
        expect(r.serverId).to.be.equal('<SERVER_VOC_ID>');
        expect(r._id).to.be.equal('<SERVER_ID>');
      });
  });
});
