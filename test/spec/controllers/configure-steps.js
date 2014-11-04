'use strict';

describe('Controller: ConfigureStepsCtrl', function () {

  // load the controller's module
  beforeEach(module('citizendeskFrontendApp'));

  var ConfigureStepsCtrl,
      scope,
      $httpBackend,
      api;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _$httpBackend_, _api_) {
    scope = $rootScope.$new();
    api = _api_;
    spyOn(api.steps, 'query').and.callThrough();
    ConfigureStepsCtrl = $controller('ConfigureStepsCtrl', {
      $scope: scope
    });
    $httpBackend = _$httpBackend_;
    api.steps.def.query.resolve(mocks.steps.list);
    scope.$digest();
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
    expect(scope.disabled).toBeTruthy();
    api.steps.def.save.resolve();
    scope.$digest();
    expect(scope.disabled).toBeFalsy();
  });
  it('deletes a step', function() {
    scope.remove(scope.steps[1]);
    expect(scope.disabled).toBeTruthy();
    api.steps.def.remove.resolve();
    scope.$digest();
    expect(scope.disabled).toBeFalsy();
  });
});
