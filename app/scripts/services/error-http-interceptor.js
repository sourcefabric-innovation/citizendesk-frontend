'use strict';

/* see also http://bahmutov.calepin.co/catch-all-errors-in-angular-app.html */

angular.module('citizendeskFrontendApp')
  .factory('errorHttpInterceptor', ['Raven', '$q', 'Application', function (Raven, $q, Application) {
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
      // application level error handling (expecting Eve error format)
      response: function(response) {
        if (response.data._status === 'ERR') {
          var error = 'Server side application error';
          notify(error);
          Raven.raven.captureException(new Error(error), {
            extra: {
              responseData: response.data
            }
          });
          return $q.reject(error);
        } else {
          notify();
          return response;
        }
      }
    };
  }]);
