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
      var id = obj.id, promise;
      if(typeof id === 'undefined') {
        promise = this.$sails.post(endpoint, obj);
        promise
          .success(function(saved) {
            original.id = saved.id;
          });
      } else {
        promise = this.$sails.put(endpoint+id, obj);
      }
      promise.error(function(response) {
        Raven.captureSocketError(response);
      });
      return promise;
    };
  }]);
