'use strict';

angular.module('citizendeskFrontendApp')
  .service('Coverages', function Coverages(api, $q) {
    var deferred = $q.defer();
    this.promise = deferred.promise;
    api.coverages
      .query()
      .then(function(response) {
      deferred.resolve(response._items);
    });
  });
