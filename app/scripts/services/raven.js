'use strict';

angular.module('citizendeskFrontendApp')
  .service('Raven', ['$window', function RavenService($window) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var service = this;
    Raven
      .config('http://b1901abf077d476ba253bce45dd5bf91@sentry.sourcefabric.org/8', {
        ignoreErrors: []
      })
      .install();
    this.raven = Raven;
    this.parseSocketError = function(response) {
      var message = '';
      if('errors' in response && response.errors.length) {
        message += response.errors.join();
      }
      message += ' status: '+response.status;
      return message;
    };
    this.captureSocketError = function(response) {
      var message = this.parseSocketError(response);
      this.raven.captureMessage(message);
      return message; // for possible logging or user prompt
    };
    this.captureSocketsHelpersError = function(response, obj, path) {
      var message = 'sockets helpers error: ';
      message += this.parseSocketError(response);
      // the following breaks sentry
      //message += ' while sending ' + JSON.stringify(obj);
      message += ' to ' + path;
      this.raven.captureMessage(message);
    };
    this.handleWindowErrors = function() {
      $window.onerror = function(message, source, line, column) {
        var composed = 'window.error - ' +
          'message: ' + message +
          ', source: ' + source +
          ', line: ' + line +
          ', column: ' + column;
        service.raven.captureMessage(composed);
      };
    };
  }]);
