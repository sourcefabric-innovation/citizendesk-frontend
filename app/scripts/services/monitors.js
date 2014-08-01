'use strict';
/* jshint camelcase: false */

angular.module('citizendeskFrontendApp')
  .service('Monitors', function(api, $q, lodash) {
    var deferred,
        _ = lodash;
    this.update = function() {
      var monitors, filters;
      deferred = $q.defer();
      api.twt_streams
        .query({ embedded: '{"user_id":true}' })
        .then(function(response) {
          monitors = response._items;
          return api.twt_filters.query();
        })
        .then(function(response) {
          filters = response._items;
          monitors.forEach(function(monitor) {
            monitor.filter = _.find(filters, function(filter) {
              return filter._id === monitor.spec.filter_id;
            });
          });
          deferred.resolve(monitors);
        });
    };
    this.getByUserId = function(user_id) {
      return deferred.promise.then(function(monitors) {
        return _.find(monitors, function(monitor) {
          return monitor.user_id._id === user_id;
        });
      });
    };
    this.getById = function(id) {
      return deferred.promise.then(function(monitors) {
        return _.find(monitors, function(monitor) {
          return monitor._id === id;
        });
      });
    };
    this.update();
    this.promise = deferred.promise;
  });
