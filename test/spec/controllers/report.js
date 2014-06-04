'use strict';

describe('Controller: ReportCtrl', function () {

  // load the controller's module
  beforeEach(module('citizendeskFrontendApp'));

  var ReportCtrl,
  scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ReportCtrl = $controller('ReportCtrl', {
      $scope: scope
    });
  }));

  xit('attaches a report to the scope', function () {
    expect(scope.report).toBeDefined();
  });
  xit('disables report verification', function() {
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
    xit('enables report verification', function() {
      expect(scope.wait).toBe(false);
    });
  });
  describe('starting with existent steps', function() {
    beforeEach(inject(function ($controller, $rootScope) {
      scope = $rootScope.$new();
      ReportCtrl = $controller('ReportCtrl', {
        $scope: scope
      });
    }));
    xit('disables report verification', function() {
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
      xit('enables report verification', function() {
        expect(scope.wait).toBe(false);
      });
    });
  });
});
