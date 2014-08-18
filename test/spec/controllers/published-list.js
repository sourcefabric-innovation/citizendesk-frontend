'use strict';

describe('Controller: PublishedListCtrl', function () {

  // load the controller's module
  beforeEach(module('citizendeskFrontendApp'));

  var PublishedListCtrl,
      scope,
      api;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _api_) {
    api = _api_;
    spyOn(api.reports, 'query').andCallThrough();

    scope = $rootScope.$new();
    PublishedListCtrl = $controller('PublishedListCtrl', {
      $scope: scope
    });
  }));

  it('queries for reports', function () {
    expect(api.reports.query).toHaveBeenCalled();
  });
  describe('with reports', function(){
    beforeEach(function(){
      api.reports.def.query.resolve(mocks.reports['list-not-paginated']);
      scope.$digest();
    });
    it('saves reports in the right place', function(){
      expect(scope.reports.length).toBe(1);
    });
    it('builds the linked texts', function(){
      expect(scope.reports[0].linkedText).toBeDefined();
    });
  });
});
