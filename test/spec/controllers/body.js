'use strict';

describe('Controller: BodyCtrl', function () {

  // load the controller's module
  beforeEach(module('citizendeskFrontendApp'));

  var BodyCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    BodyCtrl = $controller('BodyCtrl', {
      $scope: scope
    });
  }));

  it('should proxy a service', function () {
    expect(scope.service).toBeDefined();
  });
});
