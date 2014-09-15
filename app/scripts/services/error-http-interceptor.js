'use strict';

/* see also http://bahmutov.calepin.co/catch-all-errors-in-angular-app.html */

angular.module('citizendeskFrontendApp')
  .factory('errorHttpInterceptor', function ($injector, $q, Body, Raven) {
    function error(response, message) {
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
          return response;
        }
      }
    };
  });
