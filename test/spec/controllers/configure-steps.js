'use strict';

describe('Controller: ConfigureStepsCtrl', function () {

  // load the controller's module
  beforeEach(module('citizendeskFrontendApp'));

  var ConfigureStepsCtrl,
    scope,
  SocketsHelpers = globals.SocketsHelpers;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ConfigureStepsCtrl = $controller('ConfigureStepsCtrl', {
      $scope: scope,
      $sails: globals.sails,
      SocketsHelpers: SocketsHelpers
    });
    spyOn(SocketsHelpers, 'save').andCallThrough();
  }));

  it('attaches a list of steps to the scope', function () {
    expect(scope.steps.length).toBe(3);
  });
  it('adds a step', function() {
    scope.add();
    expect(scope.steps.length).toBe(4);
  });
  it('saves a step', function() {
    scope.save(scope.steps[1]);
    expect(SocketsHelpers.save).toHaveBeenCalled();
  });
});
