'use strict';

describe('Controller: ConfigureStatusPresentationCtrl', function () {

  // load the controller's module
  beforeEach(module('citizendeskFrontendApp'));

  var ConfigureStatusPresentationCtrl,
      scope,
      api;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _api_) {
    api = _api_;
    spyOn(api.report_statuses, 'query').andCallThrough();
    
    scope = $rootScope.$new();
    ConfigureStatusPresentationCtrl = $controller('ConfigureStatusPresentationCtrl', {
      $scope: scope
    });
  }));

  it('queries for report statuses', function () {
    expect(api.report_statuses.query).toHaveBeenCalled();
    api.report_statuses.def.query.resolve({ _items:[{}, {}] });
    scope.$digest();
    expect(scope.statuses).toBeDefined();
  });
  it('saves a status', function() {
    scope.save({});
    expect(scope.disabled).toBeTruthy();
    api.report_statuses.def.save.resolve();
    scope.$digest();
    expect(scope.disabled).toBeFalsy();
  });
});
