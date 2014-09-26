'use strict';

// i could test with `angular.mock.TzDate`, but i had some problems in
// the past using `getTimezoneOffset` with that mock. thus i wrote
// just generic tests

describe('Controller: ConfigureTimeZoneCtrl', function () {

  // load the controller's module
  beforeEach(module('citizendeskFrontendApp'));

  var ConfigureTimeZoneCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ConfigureTimeZoneCtrl = $controller('ConfigureTimeZoneCtrl', {
      $scope: scope
    });
    scope.$digest();
  }));

  it('produces a number in the expected range', function () {
    expect(scope.offset).toEqual(jasmine.any(Number));
    // i am not totally sure about the following values
    expect(scope.offset).toBeLessThan(14);
    expect(scope.offset).toBeGreaterThan(-11);
  });
  it('produces a string starting with + o -, followed by one or 2 numbers', function() {
    expect(/^[+-][0-9]{1,2}$/.test(scope.offsetString)).toBe(true);
  });
});
