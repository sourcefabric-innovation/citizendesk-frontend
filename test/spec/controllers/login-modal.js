'use strict';

describe('Controller: LoginModalCtrl', function () {

  // load the controller's module
  beforeEach(module('citizendeskFrontendApp'));

  var LoginModalCtrl,
      scope,
      deferred;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $q) {
    scope = $rootScope.$new();
    scope.$close = jasmine.createSpy('modal close');
    deferred = $q.defer();
    LoginModalCtrl = $controller('LoginModalCtrl', {
      $scope: scope,
      auth: {
        login: function() {
          return deferred.promise;
        }
      }
    });
  }));

  it('submits', function () {
    scope.submit();
    deferred.resolve();
    scope.$digest();
    expect(scope.$close).toHaveBeenCalled();
  });
  it('displays error messages to the user', function() {
    scope.submit();
    deferred.reject(['whatever']);
    scope.$digest();
    expect(scope.messages.whatever).toBe(true);
  });
  it('reset messages on credentials change', function(){
    scope.messages = { error: true };
    scope.onCredentialsChange('wrong', 'right');
    expect(scope.messages.error).toBeFalsy();
  });
});
