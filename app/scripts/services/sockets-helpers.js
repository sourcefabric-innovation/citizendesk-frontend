'use strict';

angular.module('citizendeskFrontendApp')
  .service('SocketsHelpers', ['$sails', 'Raven', function SocketsHelpers($sails, Raven) {
    this.$sails = $sails; // for the tests
    this.save = function(original, endpoint) {
      var obj = angular.copy(original);
      /* the $$hashKey property is added by angular to elements which
       * are used in a ng-repeat directive, but it conflicts with
       * mongo, so i have to remove it */
      delete obj.$$hashKey;
      var id = obj.id, promise, path;
      if(typeof id === 'undefined') {
        path = endpoint;
        promise = this.$sails.post(path, obj);
        promise
          .success(function(saved) {
            original.id = saved.id;
          });
      } else {
        path = endpoint + id;
        promise = this.$sails.put(path, obj);
      }
      promise.error(function(response) {
        Raven.captureSocketsHelpersError(response, obj, path);
      });
      return promise;
    };
  }]);
