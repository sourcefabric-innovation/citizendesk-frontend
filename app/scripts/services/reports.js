'use strict';
/* jshint eqeqeq:false */

angular.module('citizendeskFrontendApp')
  .service('Reports', ['$sails', '$rootScope', function Reports($sails, $rootScope) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var service = this;
    this.reports = [];
    $sails
      .get('/reports?limit=1&sort=created%20DESC')
      .success(function() {
        /* doing this just in order to be subscribed to the collection */
      });
    $sails
      .on('message', function (message) {
        if (message.model == 'reports' && message.verb == 'create') {
          $rootScope.$apply(function() {
            service.reports.unshift(message.data);
          });
        }
      });
  }]);
