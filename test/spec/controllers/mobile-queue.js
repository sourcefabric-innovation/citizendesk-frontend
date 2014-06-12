'use strict';

describe('Controller: MobileQueueCtrl', function () {

  // load the controller's module
  beforeEach(module('citizendeskFrontendApp'));

  var MobileQueueCtrl,
      scope,
      $httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _$httpBackend_) {
    scope = $rootScope.$new();
    MobileQueueCtrl = $controller('MobileQueueCtrl', {
      $scope: scope
    });
    $httpBackend = _$httpBackend_;
    $httpBackend
      .expectGET(globals.root)
      .respond(mocks.root);
    $httpBackend
      .expectGET(globals.root +
                 'reports?where=%7B%22feed_type%22:%22sms%22%7D')
      .respond(mocks.reports.list);
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingRequest();
    $httpBackend.verifyNoOutstandingExpectation();
  });

  it('should attach a list of reports to the scope', function () {
    $httpBackend.flush();
    expect(scope.reports.length).toBe(25);
  });
});
