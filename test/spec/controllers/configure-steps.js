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
    $httpBackend.flush();
  }));

  it('attaches a list of steps to the scope', function () {
    expect(scope.steps.length).toBe(3);
  });
  it('adds a step', function() {
    scope.add();
    expect(scope.steps.length).toBe(4);
    expect(scope.disabled).toBe(false);
  });
  it('saves a step', function() {
    scope.save(scope.steps[1]);
  });
  it('deletes a step', function() {
    scope.remove(scope.steps[1]);
  });
});
