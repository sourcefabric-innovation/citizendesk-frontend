/*
 * these services are so pervasive, that i have to mock them once for
 * all in order to avoid affecting all the tests. this has several
 * drawbacks, one being that i do not know how to test these specific
 * services, thus the logic within them should be quite small. Another
 * drawback is that the unit tests differ from the actual setup */
angular.module('citizendeskFrontendApp')
  .service('auth', ['$q', function($q) {
    this.login = function() {
      var deferred = $q.defer();
      deferred.resolve({});
      return deferred.promise;
    };
  }])
  .factory('cacheBuster', function() {
    return {
      request: function(a) {
        return a;
      }
    }
  });
