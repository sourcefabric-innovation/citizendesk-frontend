'use strict';

describe('Controller: LoginModalCtrl', function () {

  // load the controller's module
  beforeEach(module('citizendeskFrontendApp'));

  var LoginModalCtrl,
      scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $q) {
    scope = $rootScope.$new();
    scope.$close = jasmine.createSpy('modal close');
    LoginModalCtrl = $controller('LoginModalCtrl', {
      $scope: scope,
      auth: {
        login: function() {
          return $q.when();
        }
      }
    });
  }));

  it('submits', function () {
    scope.submit();
    scope.$digest();
    expect(scope.$close).toHaveBeenCalled();
  });
});
