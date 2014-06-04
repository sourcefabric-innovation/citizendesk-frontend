'use strict';

describe('Controller: TwitterSearchCtrl', function () {

  // load the controller's module
  beforeEach(module('citizendeskFrontendApp'));

  var TwitterSearchCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TwitterSearchCtrl = $controller('TwitterSearchCtrl', {
      $scope: scope,
      $routeParams: {
      },
    });
  }));

  it('attaches a queue to the scope', function () {
    expect(scope.queue).toBeDefined();
  });
});
