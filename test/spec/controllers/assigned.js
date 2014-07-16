'use strict';

describe('Controller: AssignedCtrl', function () {

  // load the controller's module
  beforeEach(module('citizendeskFrontendApp'));

  var AssignedCtrl,
      Assign = { // service
        users: [1, 2, 3],
        updateTotals: jasmine.createSpy()
      },
      scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AssignedCtrl = $controller('AssignedCtrl', {
      $scope: scope,
      Assign: Assign
    });
  }));

  it('should attach users to the scope', function () {
    expect(scope.users.length).toBe(3);
  });
  it('calls the update totals function', function() {
    expect(Assign.updateTotals).toHaveBeenCalled();
  });
});
