'use strict';

angular.module('citizendeskFrontendApp')
  .service('PagePolling', function PagePolling($interval, $rootScope) {
    var service = this;
    this.promises = []; // exposed for testing
    this.setInterval = function(handler, delay) {
      var promise = $interval(handler, delay);
      service.promises.push(promise);
      return promise;
    };
    $rootScope.$on('$routeChangeStart', function() {
      service.promises.forEach(function(promise) {
        $interval.cancel(promise);
      });
      service.promises = [];
    });
  });
