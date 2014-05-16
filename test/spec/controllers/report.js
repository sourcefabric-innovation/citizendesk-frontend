'use strict';

describe('Controller: ReportCtrl', function () {

  // load the controller's module
  beforeEach(module('citizendeskFrontendApp'));

  var ReportCtrl,
  scope,
  $sails;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    $sails = {
      get: function() {
        // after a report, the steps list will be fetched
        $sails.get = function() {
          return globals.sailsWrapResponse([{
            description: 'test step 1'
          }, {
            description: 'test step 2'
          }]);
        };
        return globals.sailsWrapResponse({
          // report body
        });
      }
    };
    ReportCtrl = $controller('ReportCtrl', {
      $scope: scope,
      $sails: $sails
    });
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
      $sails = {
        get: function() {
          return globals.sailsWrapResponse({
            // report body
            steps: [{
              description: 'test step 1',
              done: false
            }, {
              description: 'test step 2',
              done: false
            }]
          });
        }
      };
      ReportCtrl = $controller('ReportCtrl', {
        $scope: scope,
        $sails: $sails
      });
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
