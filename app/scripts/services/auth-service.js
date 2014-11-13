'use strict';

angular.module('citizendeskFrontendApp')
  .provider('auth', function() {
    var provider = this;
    this.disabled = false;
    this.$get = ['$q', 'api', 'session', 'authAdapter', function($q, api, session, authAdapter) {

      if (provider.disabled) {
        return {};
      } else {
        return {
          login: function(username, password) {
            return authAdapter.authenticate(username, password)
              .then(function(sessionData) {
                return api.users.getById(sessionData.user)
                  .then(function(userData) {
                    session.start(sessionData, userData);
                    return session.identity;
                  });
              });
          },
          logout: function() {
            session.clear();
          }
        };
      }
    }];
  });
