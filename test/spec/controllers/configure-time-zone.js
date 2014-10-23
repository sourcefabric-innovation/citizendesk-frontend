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
  it('does not show an offset string when the offset is zero', function() {
    scope.getOffset = function() { return 0; };
    scope.watcher();
    expect(scope.offsetString).toBe('');
  });
  it('just converts to string when the offset is negative', function() {
    scope.getOffset = function() { return 60; };
    scope.watcher();
    expect(scope.offsetString).toBe('-1');
  });
  // adding extra tests for the test regular expression! you never know
  describe('our tester', function() {
    var tester;
    beforeEach(function() {
      tester = new RegExp('^([+-][1]?[0-9])?$');
    });
    it('accepts a string starting with + followed by one number', function() {
      expect(tester.test('+2')).toBe(true);
    });
    it('accepts a string starting with - followed by two numbers', function() {
      expect(tester.test('-12')).toBe(true);
    });
    it('accepts an empty string', function() {
      expect(tester.test('')).toBe(true);
    });
    it('accepts our offset string', function() {
      expect(tester.test(scope.offsetString)).toBe(true);
    });
  });
});
