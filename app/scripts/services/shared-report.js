'use strict';

angular.module('citizendeskFrontendApp')
  .service('SharedReport', function (Bacon, api, $rootScope) {
    var existing = {};
    // this service is intended for a report shared between several
    // controllers in the same page
    $rootScope.$on('$locationChangeSuccess', function() {
      existing = {};
    });
    function newShared(id) {
      var stream = new Bacon.Bus(),
          property = stream.toProperty();
      api.reports.getById(id)
        .then(function (report) {
          stream.push(report);
        });
      return {
        // the stream is for push and the property for listening
        stream: stream,
        property: property,
        remove: function() {
          delete existing[id];
        },
        update: function() {
          api.reports.getById(id)
            .then(function (report) {
              stream.push(report);
            });
        }
      };
    }
    this.get = function(id) {
      if (!(id in existing)) {
        existing[id] = newShared(id);
      }
      return existing[id];
    };
  });
