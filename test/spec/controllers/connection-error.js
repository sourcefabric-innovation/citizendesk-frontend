'use strict';

describe('Controller: ConnectionErrorCtrl', function () {

  // load the controller's module
  beforeEach(module('citizendeskFrontendApp'));

  var ConnectionErrorCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ConnectionErrorCtrl = $controller('ConnectionErrorCtrl', {
      $scope: scope
    });
  }));

  it('proxies the application service', function () {
    expect(scope.application).toBeDefined();
  });
});
