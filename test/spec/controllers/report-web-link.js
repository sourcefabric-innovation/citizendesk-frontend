'use strict';

describe('Controller: ReportWebLinkCtrl', function () {

  // load the controller's module
  beforeEach(module('citizendeskFrontendApp'));

  var ReportCtrl,
      scope,
      $httpBackend,
      Report = {
        getSelectedCoverage: function(){},
        checkPublished: function(){},
        getVerificationHandler: function(){ return function(){}; },
        addSteps: function(){},
        getStepsHandler: function(){ return function(){}; }
      },
      Coverages = { promise: { then: function(){} } },
      $window = {
        history: {
          back: function(){}
        }
      },
      PageBroker = {
        load: function(){}
      },
      dependencies = {
        $routeParams: {id: 'abcdef'},
        Report: Report,
        Coverages: Coverages,
        $window: $window,
        PageBroker: PageBroker
      },
      $q,
      api;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _$httpBackend_, _$q_, _api_) {
    $q = _$q_;
    api = _api_;
    spyOn(api.reports, 'getById').and.callThrough();
    spyOn(api.steps, 'query').and.callThrough();
    spyOn(Report, 'getVerificationHandler').and.callThrough();
    spyOn(PageBroker, 'load');

    scope = $rootScope.$new();
    dependencies.$scope = scope;
    ReportCtrl = $controller('ReportWebLinkCtrl', dependencies);
    $httpBackend = _$httpBackend_;
    api.reports.def.getById
      .resolve(angular.copy(mocks.reports['5418128a9c616745002376bb']));
    api.steps.def.query.resolve(mocks.steps.list);
    scope.$digest();
  }));

  it('has the correct link to the endpoint', function() {
    expect(scope.report._links.self.href)
      .toBe('/reports/5418128a9c616745002376bb');
  });
  it('attaches a report to the scope', function () {
    expect(scope.report).toBeDefined();
  });
  it('leads to the media select page', function() {
    scope.toMediaSelection();
    var args = PageBroker.load.calls.mostRecent().args;
    expect(args[0])
      .toBe('/select-media-to-publish/web_link/5418128a9c616745002376bb');
    expect(args[1]._id).toBe(scope.report._id);
  });
});
