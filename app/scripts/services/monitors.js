'use strict';
/* jshint camelcase: false */
/*

 this service is not indended to hold status about monitors but just
 the logic in order to manipulate monitors

 */
angular.module('citizendeskFrontendApp')
  .service('Monitors', ['$resource', 'prefix', '$q', 'Raven', 'FilterGrouper', '$rootScope', '$http', function Monitors($resource, prefix, $q, Raven, FilterGrouper, $rootScope, $http) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var resources = {
      filter: $resource(prefix + '/twt_filters/:id'),
      stream: $resource(prefix + '/twt_streams/:id'),
      key: $resource(prefix + '/twt_oauths/:id')
    };
    this.resources = resources; // exposing for tests
    /*
     register the monitor for real time report creation. doing like
     this for every monitor is inefficient, but the number of monitors
     is very low
     *
    function register(monitor) {
      $sails.on('message', function (message) {
        if (message.model === 'reports' && message.verb === 'create') {
          $rootScope.$apply(function() {
            var report = message.data,
                filter = report.channels[0].filter,
                slug = FilterGrouper.getSlug(filter);
            if (slug === monitor.slug) {
              monitor.reports.unshift(report);
            }
          });
        }
      });
    }
     */
    function updateMonitorFromFilter(monitor, filter) {
      monitor.slug = FilterGrouper.getSlug(filter.spec);
      monitor.description = FilterGrouper.getDescription(filter.spec);
    }
    function addFilter(monitor, filters) {
      var id = monitor.spec.filter_id;
      for (var i=0; i<filters.length; i++ ) {
        var filter = filters[i];
        if (filter._id === id) {
          monitor.filter = angular.copy(filter);
          updateMonitorFromFilter(monitor, filter);
          return;
        }
      }
      throw new Error('monitor '+monitor._id+' has no associated filter');
    }
    function addKey(monitor, keys) {
      var id = monitor.spec.oauth_id;
      for (var i=0; i<keys.length; i++) {
        var key = keys[i];
        if (key._id === id) {
          monitor.key = angular.copy(key);
          return;
        }
      }
      throw new Error('monitor has no associated key');
    }
    this.getMonitors = function() {
      var deferred = $q.defer();
      $q.all({
        filters: resources.filter.query().$promise,
        streams: resources.stream.query().$promise,
        keys:    resources.key.query().$promise
      }).then(function(results) {
        /*

         the monitor object is an aggregation of a stream with the
         corresponding filter and key. i will build these objects
         starting from the streams

         */
        var monitors = [];
        results.streams.forEach(function(stream) {
          if (stream.control.switch_on) {
            var monitor = angular.copy(stream);
            monitor.reports = [];
            // a monitor is also a queue with type 'monitor'
            monitor.type = 'monitor';
            //register(monitor);
            addFilter(monitor, results.filters);
            addKey(monitor, results.keys);
            monitors.push(monitor);
          }
        });
        deferred.resolve(monitors);
      }).catch(Raven.promiseErrorHandler);
      return deferred.promise;
    };

    this.getBySlug = function(queues, slug) {
      for (var i=0; i<queues.length; i++) {
        var queue = queues[i];
        if (queue.type === 'monitor') {
          if (typeof slug === 'undefined' || queue.slug === slug) {
            return queue;
          }
        }
      }
    };
    function restart(id) {
      var path = prefix + '/twt_streams',
          deferred = $q.defer();
      $http
        .get(path + '/stop?id='+id)
        .success(function() {
          $http
            .get(path + '/start?id='+id)
            .success(function() {
              deferred.resolve();
            })
            .error(function() {
              Raven.raven.captureMessage('error starting stream');
              deferred.reject('error starting');
            });
        })
        .error(function() {
          Raven.raven.captureMessage('error stopping stream');
          deferred.reject('error stopping');
        });
      return deferred.promise;
    }
    this.retrack = function(monitor, newTrack) {
      var deferred = $q.defer();
      monitor.filter.spec.track = newTrack;
      $http({
        method: 'PUT',
        url: prefix+'/twt_filters/'+monitor.filter._id,
        data: monitor.filter,
      })
        .success(function() {
          restart(monitor._id)
            .then(function() {
              // empty collected reports
              monitor.reports = [];
              // update the monitor properties related to the filter
              updateMonitorFromFilter(monitor, monitor.filter);
              // tell upstream
              deferred.resolve();
            })
            .catch(Raven.promiseErrorHandler);
        })
        .error(Raven.promiseErrorHandler);
      return deferred.promise;
    };
  }]);
