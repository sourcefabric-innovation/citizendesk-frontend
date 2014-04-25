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
      $scope: scope,
      $sails: {
        get: function() {
          return globals.sailsWrapResponse({
            // report body
          });
        }
      }
    });
  }));

  it('attaches a report to the scope', function () {
    expect(scope.report).toBeDefined();
  });
});
