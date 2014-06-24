angular.module('citizendeskFrontendApp')
  .service('auth', ['$q', function($q) {
    this.login = function() {
      var deferred = $q.defer();
      deferred.resolve({});
      return deferred.promise;
    };
  }]);
