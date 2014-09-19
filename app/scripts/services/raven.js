'use strict';

angular.module('citizendeskFrontendApp')
  .service('Raven', function RavenService($location, session) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var service = this;

    this.install = function() {
      Raven
        .config('https://b1901abf077d476ba253bce45dd5bf91@sentry.sourcefabric.org/8', {
          ignoreErrors: [],
          dataCallback: function(data) {
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
          }
        })
        .install();
      service.raven = Raven;
    };
  });
