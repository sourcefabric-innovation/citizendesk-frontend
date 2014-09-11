'use strict';

describe('Controller: ProcessedQueuesCtrl', function () {

  // load the controller's module
  beforeEach(module('citizendeskFrontendApp'));

  var ProcessedQueuesCtrl,
      scope,
      ProcessedQueues = {},
      requests,
      allResponses = {
        streams: {},
        properties: {}
      };

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, Bacon) {
    requests = [];
    ProcessedQueues.requests = new Bacon.Bus();
    ['assigned', 'dismissed'].forEach(function (key) {
      var stream = new Bacon.Bus();
      allResponses.streams[key] = stream;
      allResponses.properties[key] = stream.toProperty();
    });
    ProcessedQueues.requests.onValue(function(value) {
      requests.push(value);
    });
    ProcessedQueues.getResponses = function(key) {
      if (key in allResponses.properties) {
        // we can mock responses on these
        return allResponses.properties[key];
      } else {
        return new Bacon.Bus().toProperty();
      }
    };

    scope = $rootScope.$new();
    ProcessedQueuesCtrl = $controller('ProcessedQueuesCtrl', {
      $scope: scope,
      ProcessedQueues: ProcessedQueues
    });
  }));
  it('pushes requests on initialisation', function() {
    expect(requests).toEqual([ 'published', 'dismissed', 'debunked', 'assigned' ]);
  });
  describe('after some responses came', function() {
    beforeEach(function() {
      allResponses.streams.assigned.push({
        _meta: {
          total: 3
        }
      });
      allResponses.streams.dismissed.push({
        _meta: {
          total: 4
        }
      });
    });
    it('saves the responses', function() {
      expect(scope.totals.assigned).toBe(3);
      expect(scope.totals.dismissed).toBe(4);
    });
    it('has the values after a new initialisation', inject(function($controller, $rootScope) {
      scope = $rootScope.$new();
      ProcessedQueuesCtrl = $controller('ProcessedQueuesCtrl', {
        $scope: scope,
        ProcessedQueues: ProcessedQueues
      });
      expect(scope.totals.assigned).toBe(3);
      expect(scope.totals.dismissed).toBe(4);
    }));
  });
});
