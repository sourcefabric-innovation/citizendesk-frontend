'use strict';

angular.module('citizendeskFrontendApp')
  .service('PageBroker', function PageBroker($location, $rootScope, $q) {
    var data,
        target;
    function reset() {
      data = null;
      target = null;
    }
    reset();
    $rootScope.$on('$locationChangeSuccess', function() {
      if ($location.url() !== target) {
        reset();
      }
    });
    this.load = function(nextTarget, nextData) {
      data = nextData;
      target = nextTarget;
      $location.url(nextTarget);
    };
    this.getData = function(fallback) {
      var deferred = $q.defer();
      if (data === null) {
        $location.url(fallback);
        deferred.reject();
      } else {
        deferred.resolve(angular.copy(data));
      }
      return deferred.promise;
    };
  });
