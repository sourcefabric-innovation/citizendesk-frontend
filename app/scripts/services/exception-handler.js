'use strict';

angular.module('citizendeskFrontendApp')
  .factory('$exceptionHandler', ['Raven', function (Raven) {
    return function (exception, cause) {
      console.error(exception.stack);
      Raven.raven.captureException(exception, {
        extra: {
          cause: cause
        }
      });
    };
  }]);
