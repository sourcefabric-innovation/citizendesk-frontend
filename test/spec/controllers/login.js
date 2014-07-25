'use strict';

describe('Controller: LoginCtrl', function () {

  // load the controller's module
  beforeEach(module('citizendeskFrontendApp'));

  var LoginCtrl,
      scope,
      watchExpression,
      watchListener,
      $modal = {
        open: jasmine.createSpy()
      };

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    spyOn(scope, '$watch').andCallFake(function(expression, listener) {
      watchExpression = expression;
      watchListener = listener;
    });
    LoginCtrl = $controller('LoginCtrl', {
      $scope: scope,
      $modal: $modal
    });
  }));

  it('shows the modal if the token is missing', inject(function($q) {
    var deferred = $q.defer();
    watchListener(null);
    scope.$digest(); // in order to resolve the $q promise
    expect($modal.open).toHaveBeenCalled();
  }));
});
