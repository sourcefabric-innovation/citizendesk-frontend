'use strict';

describe('Controller: MonitorsCtrl', function () {

  // load the controller's module
  beforeEach(module('citizendeskFrontendApp'));

  var MonitorsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MonitorsCtrl = $controller('MonitorsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
