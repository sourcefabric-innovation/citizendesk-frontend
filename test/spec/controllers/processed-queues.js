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
    ['published_assigned', 'not_published_dismissed'].forEach(function (key) {
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
    expect(requests.length).toBe(8);
  });
  describe('after some responses came', function() {
    beforeEach(function() {
      allResponses.streams.published_assigned.push({
        _meta: {
          total: 3
        }
      });
      allResponses.streams.not_published_dismissed.push({
        _meta: {
          total: 4
        }
      });
    });
    it('saves the responses', function() {
      expect(scope.totals.published_assigned).toBe(3);
      expect(scope.totals.not_published_dismissed).toBe(4);
    });
    it('has the values after a new initialisation', inject(function($controller, $rootScope) {
      scope = $rootScope.$new();
      ProcessedQueuesCtrl = $controller('ProcessedQueuesCtrl', {
        $scope: scope,
        ProcessedQueues: ProcessedQueues
      });
      expect(scope.totals.published_assigned).toBe(3);
      expect(scope.totals.not_published_dismissed).toBe(4);
    }));
  });
});
