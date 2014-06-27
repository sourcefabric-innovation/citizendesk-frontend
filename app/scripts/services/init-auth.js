'use strict';

angular.module('citizendeskFrontendApp')
  .factory('initAuth', ['$rootScope', '$route', '$location', '$http', '$window', 'session', function($rootScope, $route, $location, $http, $window, session) {

    return function() {

      // populate current user
      $rootScope.$watch(function() {
        return session.identity;
      }, function () {
        $rootScope.currentUser = session.identity;
      });

      // set auth header
      $rootScope.$watch(function() {
        return session.token;
      }, function(token) {
        if (token) {
          $http.defaults.headers.common.Authorization = 'Basic ' + btoa(token + ':');
        } else {
          delete $http.defaults.headers.common.Authorization;
        }
      });

      // prevent routing when there is no token
      $rootScope.$on('$locationChangeStart', function (e) {
        if (!session.token) {
          session.getIdentity().then(function() {
            $http.defaults.headers.common.Authorization = 'Basic ' + btoa(session.token + ':');
            $route.reload();
          });
          e.preventDefault();
        }
      });
    };
    
  }]);
