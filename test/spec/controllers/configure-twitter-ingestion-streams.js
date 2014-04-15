'use strict';

describe('Controller: ConfigureTwitterIngestionStreamsCtrl', function () {

  // load the controller's module
  beforeEach(module('citizenfrontApp'));

  var ConfigureTwitterIngestionStreamsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ConfigureTwitterIngestionStreamsCtrl = $controller('ConfigureTwitterIngestionStreamsCtrl', {
      $scope: scope,
      $sails: $sails
    });
  }));

  it('should attach streams to the scope', function () {
    expect(scope.twtStreams.length).toBe(3);
  });
});
