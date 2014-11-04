'use strict';

describe('Controller: ReportTweetCtrl', function () {

  // load the controller's module
  beforeEach(module('citizendeskFrontendApp'));

  var ReportCtrl,
      scope,
      $httpBackend,
      Coverages = {},
      $window = {},
      dependencies = {
        $routeParams: {id: 'abcdef'},
        Coverages: Coverages,
        $window: $window,
      },
      api,
      $q,
      Report;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _$httpBackend_, _api_, _$q_, _Report_) {
    api = _api_;
    $q = _$q_;
    Report = _Report_;
    Coverages.promise = $q.when([]);
    scope = $rootScope.$new();
    dependencies.$scope = scope;
    spyOn(api.reports, 'getById').and.callThrough();
    spyOn(api.steps, 'query').and.callThrough();
    ReportCtrl = $controller('ReportTweetCtrl', dependencies);
    $httpBackend = _$httpBackend_;
    api.reports.def.getById
      .resolve(angular.copy(mocks.reports['538df48f9c616729ad000035']));
    api.steps.def.query.resolve(mocks.steps.list);
    scope.$digest();
  }));

  it('asked to get the report by id', function(){
    expect(api.reports.getById).toHaveBeenCalled();
  });
  it('has the correct link to the endpoint', function() {
    expect(scope.report._links.self.href).toBe('http://cd2.sourcefabric.net/citizendesk-interface/reports/53ba73019c6167462300068b');
  });
});
