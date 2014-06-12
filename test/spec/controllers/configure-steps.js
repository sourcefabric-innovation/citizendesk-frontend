'use strict';

describe('Controller: ConfigureStepsCtrl', function () {

  // load the controller's module
  beforeEach(module('citizendeskFrontendApp'));

  var ConfigureStepsCtrl,
      scope,
      $httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _$httpBackend_) {
    scope = $rootScope.$new();
    ConfigureStepsCtrl = $controller('ConfigureStepsCtrl', {
      $scope: scope
    });
    $httpBackend = _$httpBackend_;
    $httpBackend
      .expectGET(globals.root)
      .respond(mocks.root);
    $httpBackend
      .expectGET(globals.root + 'steps')
      .respond(mocks.steps.list);
  }));

  it('attaches a list of steps to the scope', function () {
    $httpBackend.flush();
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
