'use strict';

describe('Controller: ConfigureStepsCtrl', function () {

  // load the controller's module
  beforeEach(module('citizendeskFrontendApp'));

  var ConfigureStepsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ConfigureStepsCtrl = $controller('ConfigureStepsCtrl', {
      $scope: scope
    });
  }));

  xit('attaches a list of steps to the scope', function () {
    expect(scope.steps.length).toBe(3);
  });
  xit('adds a step', function() {
    scope.add();
    expect(scope.steps.length).toBe(4);
  });
  // commented when removing sails
  xit('saves a step', function() {
    scope.save(scope.steps[1]);
  });
});
