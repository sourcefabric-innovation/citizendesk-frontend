'use strict';

describe('Controller: ConfigureTwitterIngestionCtrl', function () {

  // load the controller's module
  beforeEach(module('citizendeskFrontendApp'));

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
