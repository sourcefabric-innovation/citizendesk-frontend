'use strict';

describe('Controller: RemoveCoverageModalCtrl', function () {

  // load the controller's module
  beforeEach(module('citizendeskFrontendApp'));

  var RemoveCoverageModalCtrl,
      scope,
      api;

  // Initialize the controller and a mock scope
  beforeEach(inject(function (_api_, $controller, $rootScope) {
    api = _api_;
    spyOn(api.reports, 'query').andCallThrough();

    scope = $rootScope.$new();
    scope.coverage = {
      _id: 'coverage id'
    };
    RemoveCoverageModalCtrl = $controller('RemoveCoverageModalCtrl', {
      $scope: scope
    });
  }));

  it('checks for reports published in the coverage', function () {
    expect(api.reports.query).toHaveBeenCalled();
    expect(scope.loading).toBeTruthy();
    expect(scope.disabled).toBeTruthy();
  });
  it('enables when there are no matching reports', function() {
    api.reports.def.query.resolve({
      _items: []
    });
    scope.$digest();
    expect(scope.disabled).toBeFalsy();
    expect(scope.loading).toBeFalsy();
  });
  it('keeps disabled when there are matching reports', function() {
    api.reports.def.query.resolve({
      _items: [{}]
    });
    scope.$digest();
    expect(scope.disabled).toBeTruthy();
    expect(scope.loading).toBeFalsy();
  });
});
