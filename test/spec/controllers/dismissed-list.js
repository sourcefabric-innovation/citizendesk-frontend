'use strict';

describe('Controller: DismissedListCtrl', function () {

  // load the controller's module
  beforeEach(module('citizendeskFrontendApp'));

  var DismissedListCtrl,
      scope,
      api;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _api_) {
    api = _api_;
    spyOn(api.reports, 'query').andCallThrough();

    scope = $rootScope.$new();
    DismissedListCtrl = $controller('DismissedListCtrl', {
      $scope: scope
    });
  }));

  it('queries for reports', function () {
    expect(api.reports.query).toHaveBeenCalled();
  });
});
