'use strict';

angular.module('citizendeskFrontendApp')
  .service('FilterGrouper', function FilterGrouper() {
    // AngularJS will instantiate a singleton by calling "new" on this function
    this.getDescription = function(original) {
      var filter = angular.copy(original);
      var desc = [];
      if ('track' in filter) {
        desc = desc.concat(filter.track);
      }
      if ('follow' in filter) {
        desc = desc.concat(filter.follow);
      }
      return desc.join(', ');
    };
    this.getSlug = function(original) {
      var filter = angular.copy(original);
      var desc = [];
      if ('track' in filter) {
        desc = desc.concat(filter.track);
      }
      if ('follow' in filter) {
        desc = desc.concat(filter.follow);
      }
      return desc.join('-');
    };
  });
