'use strict';

angular.module('citizendeskFrontendApp')
  .service('Raven', [function RavenService() {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var service = this;
    this.install = function() {
      Raven
        .config('http://b1901abf077d476ba253bce45dd5bf91@sentry.sourcefabric.org/8', {
          ignoreErrors: []
        })
        .install();
      service.raven = Raven;
    };
  }]);
