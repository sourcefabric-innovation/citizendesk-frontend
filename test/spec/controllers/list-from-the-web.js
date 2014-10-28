'use strict';

describe('Controller: ListFromTheWebCtrl', function () {

  // load the controller's module
  beforeEach(module('citizendeskFrontendApp'));

  var ListFromTheWebCtrl,
      scope,
      api,
      $location;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _api_, _$location_) {
    api = _api_;
    spyOn(api.reports, 'query').andCallThrough();
    $location = _$location_;
    spyOn($location, 'url');
    
    scope = $rootScope.$new();
    ListFromTheWebCtrl = $controller('ListFromTheWebCtrl', {
      $scope: scope,
      $location: $location
    });
  }));

  it('redirects when there are no reports', function () {
    expect(api.reports.query).toHaveBeenCalled();
    api.reports.def.query.resolve({
      _items: [],
      _links: {}
    });
    scope.$digest();
    expect($location.url).toHaveBeenCalled();
  });
  describe('with reports', function () {
    beforeEach(function(){
      api.reports.def.query.resolve({
        _items: [{ _id: 'to be dismissed'}, {}, {}],
        _links: {}
      });
      scope.$digest();
    });
    it('just lists reports', function(){
      expect($location.url).not.toHaveBeenCalled();
    });
    it('removes a dismissed report', function(){
      expect(scope.reports.length).toBe(3);
      scope.dismissHandler(scope.reports[0]);
      expect(scope.reports.length).toBe(2);
    });
  });
  describe('from the point of view of a simple list controller', function() {
    globals.simpleListControllerTest('ListFromTheWebCtrl');
  });
});
