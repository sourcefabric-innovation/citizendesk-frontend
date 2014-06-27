'use strict';

describe('Controller: LoginModalCtrl', function () {

  // load the controller's module
  beforeEach(module('citizendeskFrontendApp'));

  var LoginModalCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    LoginModalCtrl = $controller('LoginModalCtrl', {
      $scope: scope
    });
  }));

  it('should attach a submit method to the scope', function () {
    expect(scope.submit).toBeDefined();
  });
});
