'use strict';

describe('Controller: ConfigureTwitterIngestionCtrl', function () {

  // load the controller's module
  beforeEach(module('citizenfrontApp'));

  var ConfigureTwitterIngestionCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ConfigureTwitterIngestionCtrl = $controller('ConfigureTwitterIngestionCtrl', {
      $scope: scope,
    });
  }));

});
