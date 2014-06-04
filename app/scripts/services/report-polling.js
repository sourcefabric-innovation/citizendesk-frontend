'use strict';
/* jshint expr: true */

angular.module('citizendeskFrontendApp')
  .service('ReportPolling', ['$timeout', '$http', 'prefix', function ReportPolling($timeout, $http, prefix) {
    var service = this,
        interval = 5, // seconds
        isPolling = false,
        keepPolling = true,
        createHandlers = [],
        createdIds = {}, // for duplicate check
        timeoutId;
    // exposed in order to be mocked in tests
    this.lastDate = (new Date()).toGMTString();
    /*

     duplicate check, executes the success function just once for
     every created report

     */
    function doOnce(report, success) {
      var id = report._id;
      if (!(id in createdIds)) {
        createdIds[id] = report;
        success();
      }
    }
    function poll() {
      var where = JSON.stringify({
        produced: {
          $gt: service.lastDate
        }
      });
      var sort = '[("produced", -1)]';

      $http
        .get(prefix + '/reports', {
          params: {
            where: where,
            sort: sort
          }
        })
        .then(function(response) {
          var reports = response.data;
          if(!angular.isArray(reports)) {
              throw new Error('reports is ' + JSON.stringify(reports));
          }
          if(reports.length) {
            // i requested reports sorted by `produced` field, so
            // the first in the array has the most recent `produced`
            // value
            service.lastDate = reports[0].produced;
          }
          reports.forEach(function(report) {
            doOnce(report, function() {
              createHandlers.forEach(function(handler) {
                handler(report);
              });
            });
          });
        })
        .finally(function() {
          if (keepPolling) {
            timeoutId = $timeout(poll, interval * 1000);
          }
        });
    }
    this.onCreate = function(handler) {
      createHandlers.push(handler);
      isPolling || poll();
    };
  }]);
