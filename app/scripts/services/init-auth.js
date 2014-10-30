'use strict';

angular.module('citizendeskFrontendApp')
  .factory('initAuth', function($rootScope, $route, $location, $http, $window, session) {
    function initAuth() {

      // prevent routing when there is no token
      initAuth.onLocationChange = function (e) {
        if (!session.token) {
          session.getIdentity().then(function() {
            $http.defaults.headers.common.Authorization = 'Basic ' + btoa(session.token + ':');
            $route.reload();
          });
          e.preventDefault();
        }
      };
      $rootScope.$on('$locationChangeStart', initAuth.onLocationChange);

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
    }
    return initAuth;
  });
