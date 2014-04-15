'use strict';

describe('Controller: ConfigureTwitterIngestionOauthsCtrl', function () {

  // load the controller's module
  beforeEach(module('citizenfrontApp'));

  var ConfigureTwitterIngestionOauthsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ConfigureTwitterIngestionOauthsCtrl = $controller('ConfigureTwitterIngestionOauthsCtrl', {
      $scope: scope,
      $sails: $sails
    });
  }));

  it('should attach a list of oauths to the scope', function () {
    expect(scope.twtOauths.length).toBe(3);
  });
});
