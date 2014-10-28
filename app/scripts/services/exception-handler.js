'use strict';

angular.module('citizendeskFrontendApp')
  .factory('$exceptionHandler', function ($injector, $log) {
    return function (exception, cause) {
      $log.error(exception.stack);
      // using the injector at runtime is necessary in order to avoid
      // circular dependencies
      var Raven = $injector.get('Raven');
      Raven.raven.captureException(exception, {
        extra: {
          cause: cause
        }
      });
    };
  });
