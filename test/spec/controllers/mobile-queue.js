'use strict';

describe('Controller: MobileQueueCtrl', function () {

  // load the controller's module
  beforeEach(module('citizendeskFrontendApp'));

  var MobileQueueCtrl,
      scope,
      $httpBackend,
      PageBroker = {
        load: jasmine.createSpy()
      };

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _$httpBackend_) {
    scope = $rootScope.$new();
    MobileQueueCtrl = $controller('MobileQueueCtrl', {
      $scope: scope,
      PageBroker: PageBroker
    });
    $httpBackend = _$httpBackend_;
    $httpBackend
      .expectGET(globals.root)
      .respond(mocks.root);
    $httpBackend
      .expectGET(globals.root + 'reports?page=1&sort=%5B(%22produced%22,+-1)%5D&where=%7B%22$and%22:%5B%7B%22feed_type%22:%22sms%22%7D,%7B%22automatic%22:%7B%22$ne%22:true%7D%7D%5D%7D')
      .respond(mocks.reports['list-not-paginated']);
    $httpBackend.flush();
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingRequest();
    $httpBackend.verifyNoOutstandingExpectation();
  });

  it('assigns', function() {
    var report = { _id: 'report id' }
    scope.assign(report);
    expect(PageBroker.load.mostRecentCall.args).toEqual([
      '/assign/',
      { report: report }
    ]);
  });
  it('should attach a list of reports to the scope', function () {
    expect(scope.reports.length).toBe(1);
  });
});
