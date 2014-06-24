'use strict';

angular.module('citizendeskFrontendApp')
  .service('authAdapter', ['$http', '$q', 'config', function($http, $q, config) {

    /**
     * Authenticate using given credentials
     *
     * @param {string} username
     * @param {string} password
     * @returns {object} promise
     */
    this.authenticate = function(username, password) {
      return $http.post(config.server.url + 'auth', {
        username: username,
        password: password
      }).then(function(response) {
        $http.defaults.headers.common.Authorization = 'Basic ' + btoa(response.data.token + ':');
        return response.data;
      });
    };
  }]);
