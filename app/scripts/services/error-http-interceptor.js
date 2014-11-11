'use strict';

/* see also http://bahmutov.calepin.co/catch-all-errors-in-angular-app.html */

angular.module('citizendeskFrontendApp')
  .factory('errorHttpInterceptor', function ($injector, $q, Body, Raven, ErrorPolice) {
    function error(response, message) {
      var matches = ErrorPolice.identify(response);
      if (matches.length) {
        // this is a known error, supposed to be handled by the code
        // issuing this request which can provide better help to the
        // user in its context
        return $q.reject(matches);
      } else {
        // in this branch the error, being unexpected, will be sent to
        // Sentry. A generic error message will be shown in the top
        // application area, and the application will be reloaded
        Body.connectionError = message;
        var request50char;
        if(response.config.data) {
          request50char = JSON.stringify(response.config.data).slice(0, 50);
        } else {
          request50char = 'the corresponding request had no data';
        }
        Raven.raven.captureException(new Error(message), {
          extra: {
            responseData: response.data,
            responseStatus: response.status,
            // being a "get" request we cannot send too much stuff
            requestLocation: response.config.url,
            request50char: request50char,
            requestMethod: response.config.method
          }
        });
        // if there is a catch handler, it is probably expecting an
        // array of known error message keys
        return $q.reject([]);
      }
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
          return response;
        }
      }
    };
  });
