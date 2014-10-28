'use strict';

angular.module('citizendeskFrontendApp')
  .provider('Raven', function() {
    var provider = this;
    this.disabled;
    this.$get = ['$location', 'session', '$window', function($location, session, $window) {

      // if disabled, provide an object with the same interface, but
      // doing nothing
      if (provider.disabled) {
        return {
          install: function(){},
          raven: {
            captureException: function(){},
            captureMessage: function(){}
          }
        };
      }

      var service = {},
          location = 'https://b1901abf077d476ba253bce45dd5bf91@sentry.sourcefabric.org/8';

      service.dataCallback = function(data) {
        var username;
        if(session.identity) {
          username = session.identity.username;
        } else {
          username = 'username not available because of missing identity';
        }
        data.tags = {
          location: $location.url(),
          username: username
        };
        return data;
      };
      service.onRavenSuccess = function() {
        $window.location.reload();
      };
      service.install = function() {
        Raven
          .config(location, {
            ignoreErrors: [],
            dataCallback: service.dataCallback
          })
          .install();
        service.raven = Raven;
        // reload the page after an error has been sent to Sentry
        document.addEventListener('ravenSuccess', service.onRavenSuccess);
      };
      return service;
    }]
  });
