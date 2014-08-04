'use strict';

angular.module('citizendeskFrontendApp')
  .service('PageBroker', function PageBroker($location, $rootScope, $q, $window) {
    var data,
        target,
        goingBack;
    function reset() {
      data = null;
      target = null;
    }
    reset();
    $rootScope.$on('$locationChangeSuccess', function() {
      if (goingBack) {
        goingBack = false;
      } else if ($location.url() !== target) {
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
    this.back = function(nextData) {
      data = nextData;
      goingBack = true;
      $window.history.back();
    };
    this.getReturnedData = function(){
      return data;
    };
  });
