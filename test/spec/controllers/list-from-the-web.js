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

  describe('from the point of view of a simple list controller', function() {
    globals.simpleListControllerTest('ListFromTheWebCtrl');
  });
});
