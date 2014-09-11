'use strict';

angular.module('citizendeskFrontendApp')
  .service('ProcessedQueues', function(SavedQueries, Bacon, api) {
    var service = this,
        allResponses = {
          streams: {},
          properties: {}
        };

    this.requests = new Bacon.Bus();

    function maybeCreate(key) {
      if (!(key in allResponses.properties)) {
        var stream = new Bacon.Bus();
        allResponses.streams[key] = stream;
        allResponses.properties[key] = stream.toProperty();
      }
    }
    this.getStream = function(key) {
      maybeCreate(key);
      return allResponses.streams[key];
    };
    this.getResponses = function(key) {
      maybeCreate(key);
      return allResponses.properties[key];
    };

    this.requests.onValue(function(key) {
      api.reports
        .query({
          where: SavedQueries.getWhere(key)
        })
        .then(function(response) {
          service
            .getStream(key)
            .push(response);
        });
    });
  });
