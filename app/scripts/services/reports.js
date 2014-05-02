'use strict';
/* jshint eqeqeq:false */

angular.module('citizendeskFrontendApp')
  .service('Reports', ['$sails', '$rootScope', 'FilterGrouper', function Reports($sails, $rootScope, FilterGrouper) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var service = this;
    this.filters = {};
    this.$sails = $sails; // in order to be mocked
    this.$sails
      .get('/reports?limit=1&sort=created%20DESC')
      .success(function() {
        /* doing this just in order to be subscribed to the collection */
      });
    this.maybeAdd = function(group, filter) {
      if (!(group in service.filters)) {
        service.filters[group] = {
          description: FilterGrouper.getDescription(filter),
          reports: []
        };
      }
    };
    this.$sails
      .on('message', function (message) {
        if (message.model == 'reports' && message.verb == 'create') {
          $rootScope.$apply(function() {
            var report = message.data;
            var filter = report.channels[0].filter;
            var group = FilterGrouper.getSlug(filter);
            service.maybeAdd(group, filter);
            service.filters[group].reports.unshift(report);
          });
        }
      });
  }]);
