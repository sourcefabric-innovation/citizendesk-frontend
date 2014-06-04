'use strict';

describe('Controller: ConfigureTwitterIngestionOauthsCtrl', function () {

  // load the controller's module
  beforeEach(module('citizendeskFrontendApp'));

  var ConfigureTwitterIngestionOauthsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ConfigureTwitterIngestionOauthsCtrl = $controller('ConfigureTwitterIngestionOauthsCtrl', {
      $scope: scope
    });
  }));

  xit('should attach a list of oauths to the scope', function () {
    expect(scope.twtOauths.length).toBe(3);
  });
});
