'use strict';

/* see also http://bahmutov.calepin.co/catch-all-errors-in-angular-app.html */

angular.module('citizendeskFrontendApp')
  .factory('errorHttpInterceptor', function (Raven, $q, Application, $location, session) {
    function notify(message) {
      Application.connectionError = message;
    }
    function error(response, message) {
      notify(message);
      Raven.raven.captureException(new Error(message), {
        extra: {
          responseData: response.data,
          responseStatus: response.status,
          // being a "get" request we cannot send too much stuff
          requestLocation: response.config.url,
          request50char: JSON.stringify(response.config.data).slice(0, 50),
          requestMethod: response.config.method,
          location: $location.url(),
          username: session.identity.username
        }
      });
      return $q.reject(message);
    }
    return {
      // HTTP level error handling
      responseError: function (rejection) {
        return error(rejection, 'HTTP response error');
      },
      // application level error handling, if an Eve error format is available
      response: function(response) {
        if (response.data &&
            response.data._status &&
            response.data._status === 'ERR') {
          return error(response, 'Server side application error');
        } else {
          notify();
          return response;
        }
      }
    };
  });
