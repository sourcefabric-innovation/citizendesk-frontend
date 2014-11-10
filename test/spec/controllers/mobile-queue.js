'use strict';

describe('Controller: MobileQueueCtrl', function () {

  // load the controller's module
  beforeEach(module('citizendeskFrontendApp'));

  var MobileQueueCtrl,
      scope,
      $httpBackend,
      PageBroker = {
        load: jasmine.createSpy()
      },
      api;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _$httpBackend_, _api_) {
    scope = $rootScope.$new();
    api = _api_;
    spyOn(api.reports, 'query').and.callThrough();
    MobileQueueCtrl = $controller('MobileQueueCtrl', {
      $scope: scope,
      PageBroker: PageBroker
    });
    $httpBackend = _$httpBackend_;
    api.reports.def.query.resolve(mocks.reports['list-not-paginated']);
    scope.$digest();
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingRequest();
    $httpBackend.verifyNoOutstandingExpectation();
  });

  it('assigns', function() {
    var report = { _id: 'report id' };
    scope.assign(report);
    expect(PageBroker.load.calls.mostRecent().args).toEqual([
      '/assign/',
      { report: report }
    ]);
  });
  it('should attach a list of reports to the scope', function () {
    expect(scope.reports.length).toBe(1);
  });
  it('dismisses', function() {
    var id = scope.reports[0]._id;
    spyOn(api.reports, 'update').and.callThrough();
    scope.dismiss(scope.reports[0]);
    expect(api.reports.update).toHaveBeenCalled();
    api.reports.def.update.resolve({ _id: id });
    scope.$digest();
    expect(scope.reports.length).toBe(0);
  });
});
