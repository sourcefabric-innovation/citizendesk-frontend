'use strict';

describe('Controller: NewReportCtrl', function () {

  // load the controller's module
  beforeEach(module('citizendeskFrontendApp'));

  var NewReportCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    NewReportCtrl = $controller('NewReportCtrl', {
      $scope: scope
    });
  }));

  it('has a submit method', function () {
    expect(scope.submit).toBeDefined();
  });
  it('has a content', function () {
    expect(scope.content).toBe('');
  });
});
