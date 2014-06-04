'use strict';
/* jshint unused: false */

describe('Controller: VerifiedReportsCtrl', function () {

  // load the controller's module
  beforeEach(module('citizendeskFrontendApp'));

  var VerifiedReportsCtrl,
    scope,
  $httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _$httpBackend_) {
    scope = $rootScope.$new();
    VerifiedReportsCtrl = $controller('VerifiedReportsCtrl', {
      $scope: scope
    });
  }));

  xit('should attach a list of reports to the scope', function () {
    expect(scope.reports.length).toBe(3);
  });
});
