'use strict';

describe('Controller: LoginCtrl', function () {

  // load the controller's module
  beforeEach(module('citizendeskFrontendApp'));

  var LoginCtrl,
      scope,
      watchExpression,
      watchListener;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    spyOn(scope, '$watch').andCallFake(function(expression, listener) {
      watchExpression = expression;
      watchListener = listener;
    });
    LoginCtrl = $controller('LoginCtrl', {
      $scope: scope
    });
  }));

  it('shows the modal if the token is missing', inject(function($q) {
    spyOn(scope.modal, 'show');
    var deferred = $q.defer();
    scope.modal.$promise = deferred.promise;
    deferred.resolve();
    watchListener(null);
    scope.$digest(); // in order to resolve the $q promise
    expect(scope.modal.show).toHaveBeenCalled();
  }));
});
