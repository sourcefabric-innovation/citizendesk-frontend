'use strict';

/* see also http://bahmutov.calepin.co/catch-all-errors-in-angular-app.html */

angular.module('citizendeskFrontendApp')
  .factory('errorHttpInterceptor', function (Raven, $q, Application, $location, session) {
    function notify(error) {
      Application.connectionError = error;
    }
    return {
      // HTTP level error handling
      responseError: function (rejection) {
        var error = 'HTTP response error';
        notify(error);
        Raven.raven.captureException(new Error(error), {
          extra: {
            config: rejection.config,
            status: rejection.status
          }
        });
        return $q.reject(rejection);
      },
      // application level error handling, if an Eve error format is available
      response: function(response) {
        if (response.data &&
            response.data._status &&
            response.data._status === 'ERR') {
          var error = 'Server side application error';
          notify(error);
          Raven.raven.captureException(new Error(error), {
            extra: {
              responseData: response.data,
              // being a "get" request we cannot send too much stuff
              request50char: JSON.stringify(response.config.data).slice(0, 50),
              requestMethod: response.config.method,
              location: $location.url(),
              username: session.identity.username
            }
          });
          return $q.reject(error);
        } else {
          notify();
          return response;
        }
      }
    };
  });
