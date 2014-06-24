'use strict';

angular.module('citizendeskFrontendApp')
  .factory('AuthInterceptor', ['session', '$q', '$injector', function (session, $q, $injector) {

    function handleAuthExpired(response) {
      session.expire();
      return session.getIdentity().then(function() {
        var $http = $injector.get('$http');
        $http.defaults.headers.common.Authorization = session.token;
        response.config.headers.Authorization = session.token;
        return $http(response.config);
      });
    }

    return {
      response: function(response) {
        if (response.status === 401) {
          return handleAuthExpired(response);
        }

        return response;
      },
      responseError: function(response) {
        if (response.status === 401) {
          return handleAuthExpired(response);
        }

        return $q.reject(response);
      }
    };
  }]);
