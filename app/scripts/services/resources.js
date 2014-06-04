'use strict';

/* collection of resources which are too small to deserve a dedicated file */

angular.module('citizendeskFrontendApp')
  .service('Resources', ['resource', 'prefix', function Resources(resource, prefix) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    this.settings = {
      bool: resource(prefix + '/settings-bool/:id'),
      string: resource(prefix + '/settings-string/:id'),
      int: resource(prefix + '/settings-int/:id')
    };
    this.steps = resource(prefix + '/steps/:id');
    this.reports = resource(prefix + '/reports/:id');
  }]);
