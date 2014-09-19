'use strict';

angular.module('citizendeskFrontendApp')
  .service('auth', ['$q', 'api', 'session', 'authAdapter', function($q, api, session, authAdapter) {

    /**
     * Login using given credentials
     *
     * @param {string} username
     * @param {string} password
     * @returns {object} promise
     */
    this.login = function(username, password) {
      return authAdapter.authenticate(username, password)
        .then(function(sessionData) {
          return api.users.getById(sessionData.user)
            .then(function(userData) {
              session.start(sessionData, userData);
              return session.identity;
            });
        });
    };
  }]);
