'use strict';

describe('Controller: QueuesCtrl', function () {

  // load the controller's module
  beforeEach(module('citizendeskFrontendApp'));

  var QueuesCtrl,
      scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    QueuesCtrl = $controller('QueuesCtrl', {
      $scope: scope,
      TwitterSearches: {
        promise: {
          then: function(f) { f({_items:[]}); }
        }
      }
    });
  }));

  it('attaches twitter searches to the scope', function () {
    expect(scope.searches).toBeDefined();
  });
  it('proxies session', function() {
    expect(scope.session).toBeDefined();
  });
});
