'use strict';

describe('Controller: ReportCtrl', function () {

  // load the controller's module
  beforeEach(module('citizendeskFrontendApp'));

  var ReportCtrl,
      scope,
      $httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _$httpBackend_) {
    scope = $rootScope.$new();
    ReportCtrl = $controller('ReportCtrl', {
      $scope: scope,
      $routeParams: {id: 'abcdef'}
    });
    $httpBackend = _$httpBackend_;
    $httpBackend
      .expectGET(globals.root)
      .respond(mocks.root);
    $httpBackend
      .expectGET(globals.root + 'reports/abcdef')
      .respond(mocks.reports['538df48f9c616729ad000035']);
    $httpBackend
      .expectGET(globals.root + 'steps')
      .respond(mocks.steps.list);
    $httpBackend.flush();
  }));

  it('attaches a report to the scope', function () {
    expect(scope.report).toBeDefined();
  });
  it('disables report verification', function() {
    scope.$apply();
    expect(scope.wait).toBe(true);
  });
  describe('after all steps are done', function() {
    beforeEach(function() {
      scope.report.steps.forEach(function(step) {
        step.done = true;
      });
      scope.$apply();
    });
    it('enables report verification', function() {
      expect(scope.wait).toBe(false);
    });
  });
  describe('starting with existent steps', function() {
    beforeEach(inject(function ($controller, $rootScope) {
      scope = $rootScope.$new();
      ReportCtrl = $controller('ReportCtrl', {
        $routeParams: {id: 'abcdef'},
        $scope: scope
      });
      $httpBackend
        .expectGET(globals.root + 'reports/abcdef')
        .respond(mocks.reports['538df48f9c616729ad000035']);
      $httpBackend
        .expectGET(globals.root + 'steps')
        .respond(mocks.steps.list);
      $httpBackend.flush();
    }));
    it('disables report verification', function() {
      scope.$apply();
      expect(scope.wait).toBe(true);
    });
    describe('after all steps are done', function() {
      beforeEach(function() {
        scope.report.steps.forEach(function(step) {
          step.done = true;
        });
        scope.$apply();
      });
      it('enables report verification', function() {
        expect(scope.wait).toBe(false);
      });
    });
  });
});
