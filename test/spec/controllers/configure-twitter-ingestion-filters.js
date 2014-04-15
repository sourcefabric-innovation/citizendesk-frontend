'use strict';

describe('Controller: ConfigureTwitterIngestionFiltersCtrl', function () {

  // load the controller's module
  beforeEach(module('citizenfrontApp'));

  var ConfigureTwitterIngestionFiltersCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ConfigureTwitterIngestionFiltersCtrl = $controller('ConfigureTwitterIngestionFiltersCtrl', {
      $scope: scope,
      $sails: $sails
    });
  }));

  it('should attach filters to the scope', function () {
    expect(scope.twtFilters.length).toBe(3);
  });
});
