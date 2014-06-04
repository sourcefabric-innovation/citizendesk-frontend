'use strict';

describe('Controller: ConfigureTwitterIngestionStreamsCtrl', function () {

  // load the controller's module
  beforeEach(module('citizendeskFrontendApp'));

  var ConfigureTwitterIngestionStreamsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ConfigureTwitterIngestionStreamsCtrl = $controller('ConfigureTwitterIngestionStreamsCtrl', {
      $scope: scope
    });
  }));

  xit('should attach streams to the scope', function () {
    expect(scope.twtStreams.length).toBe(3);
  });
});
