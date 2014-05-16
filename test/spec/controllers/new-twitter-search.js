'use strict';

describe('Controller: NewTwitterSearchCtrl', function () {

  // load the controller's module
  beforeEach(module('citizendeskFrontendApp'));

  var NewTwitterSearchCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    NewTwitterSearchCtrl = $controller('NewTwitterSearchCtrl', {
      $scope: scope
    });
  }));

  it('can submit', function () {
    expect(scope.submit).toBeDefined();
  });
});
