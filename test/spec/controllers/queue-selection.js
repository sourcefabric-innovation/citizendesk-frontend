'use strict';

describe('Controller: QueueSelectionCtrl', function () {

  // load the controller's module
  beforeEach(module('citizendeskFrontendApp'));

  var QueueSelectionCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    QueueSelectionCtrl = $controller('QueueSelectionCtrl', {
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
});
