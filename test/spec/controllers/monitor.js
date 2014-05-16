'use strict';

describe('Controller: MonitorCtrl', function () {

  // load the controller's module
  beforeEach(module('citizendeskFrontendApp'));

  var MonitorCtrl,
      scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MonitorCtrl = $controller('MonitorCtrl', {
      $scope: scope,
      $routeParams: {
      },
      Monitors: {},
      Queues: {
        promise: {
          then: function() {}
        }
      }
    });
  }));

  it('attaches a monitor to the scope', function () {
    expect(scope.monitor).toBeDefined();
  });
  it('attaches queues to the scope', function() {
    expect(scope.queues.length).toBe(0);
  });
});
