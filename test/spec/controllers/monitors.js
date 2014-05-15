'use strict';

describe('Controller: MonitorsCtrl', function () {

  // load the controller's module
  beforeEach(module('citizendeskFrontendApp'));

  var MonitorsCtrl,
      scope,
      Reports = {
        filters: []
      };

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MonitorsCtrl = $controller('MonitorsCtrl', {
      $scope: scope,
      Reports: Reports
    });
  }));

  it('should attach a list of filters to the scope', function () {
    expect(scope.filters.length).toBe(0);
  });
});
