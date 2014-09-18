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
    spyOn(api.reports, 'getById').andCallThrough();
    spyOn(api.steps, 'query').andCallThrough();
    spyOn(Report, 'getVerificationHandler');
    spyOn(Report, 'getStepsHandler').andCallThrough();
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
  it('attaches a report to the scope', function () {
    expect(scope.report).toBeDefined();
  });
  it('checks when marking as verified', function() {
    scope.verified = true;
    scope.$digest();
    expect(Report.getVerificationHandler).toHaveBeenCalled();
  });
  describe('starting with existent steps', function() {
    beforeEach(inject(function ($controller, $rootScope) {
      scope = $rootScope.$new();
      dependencies.$scope = scope;
      api.reports.reset.getById();
      api.steps.reset.query();
      ReportCtrl = $controller('ReportTweetCtrl', dependencies);
      api.reports.def.getById
        .resolve(angular.copy(mocks.reports['538df48f9c616729ad000035']));
      api.steps.def.query.resolve(mocks.steps.list);
      scope.$digest();
    }));
    it('checks when verified', function() {
      scope.verified = true;
      scope.$digest();
      expect(Report.getVerificationHandler).toHaveBeenCalled();
    });
  });
  describe('starting assigned to an existent coverage', function() {
    var coverageUniqueId = '53c53ab09c61671221000000';
    beforeEach(inject(function ($controller, $rootScope) {
      var mock = angular.copy(mocks.coverages.list._items);
      mock[0].uuid = coverageUniqueId;
      Coverages.promise = $q.when(mock);

      api.reports.reset.getById();
      api.steps.reset.query();
      spyOn(Report, 'getSelectedCoverage').andCallThrough();
      spyOn($q, 'all').andCallThrough();

      scope = $rootScope.$new();
      dependencies.$scope = scope;
      ReportCtrl = $controller('ReportTweetCtrl', dependencies);

      var rep = angular.copy(mocks.reports['538df48f9c616729ad000035']);
      rep.coverages = {
        outgested: [coverageUniqueId],
        published: [coverageUniqueId]
      };
      api.reports.def.getById.resolve(rep);
      api.steps.def.query.resolve(mocks.steps.list);
      scope.$digest();
    }));
    it('tries to get the selected coverage', function(){
      expect(Report.getSelectedCoverage).toHaveBeenCalled();
      var args = Report.getSelectedCoverage.mostRecentCall.args;
      expect(args[1].length).toBe(2);
    });
    it('picks the coverage as the selected one', function(){
      expect(scope.selectedCoverage.uuid).toBe(coverageUniqueId);
    });
  });
});
