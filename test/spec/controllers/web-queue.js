'use strict';

describe('Controller: WebQueueCtrl', function () {

  // load the controller's module
  beforeEach(module('citizendeskFrontendApp'));

  var WebQueueCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    WebQueueCtrl = $controller('WebQueueCtrl', {
      $scope: scope
    });
  }));

  it('attaches reports to the scope', function () {
    expect(scope.reports).toBeDefined();
  });
});
