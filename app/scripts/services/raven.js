'use strict';

angular.module('citizenfrontApp')
  .service('Raven', function RavenService() {
    // AngularJS will instantiate a singleton by calling "new" on this function
    Raven
      .config('http://b1901abf077d476ba253bce45dd5bf91@sentry.sourcefabric.org/8')
      .install();
    this.raven = Raven;
    this.captureSocketError = function(response) {
      var message = '';
      if('errors' in response && response.errors.length) {
        message += response.errors.join();
      }
      message += ' status: '+response.status;
      this.raven.captureMessage(message);
      return message; // for logging and user prompt
    };
  });
