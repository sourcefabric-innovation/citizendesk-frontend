'use strict';

/* see also http://bahmutov.calepin.co/catch-all-errors-in-angular-app.html */

angular.module('citizendeskFrontendApp')
  .factory('errorHttpInterceptor', ['Raven', '$q', function (Raven, $q) {
    return {
      // HTTP level error handling
      responseError: function (rejection) {
        Raven.raven.captureException(new Error('HTTP response error'), {
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
          Raven.raven.captureException(new Error('Eve response error'), {
            extra: {
              responseData: response.data
            }
          });
          return $q.reject('Eve error');
        } else {
          return response;
        }
      }
    };
  }]);
