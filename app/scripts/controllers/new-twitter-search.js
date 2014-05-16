'use strict';

angular.module('citizendeskFrontendApp')
  .controller('NewTwitterSearchCtrl', ['TwitterSearches', 'Queues', '$scope', '$resource', 'prefix', 'Raven', '$http', '$location', function (TwitterSearches, Queues, $scope, $resource, prefix, Raven, $http, $location) {
    /*
     create the search, get the id from the database, use it in order
     to trigger an actual search action
     */
    var Search = $resource(prefix + '/twt-searches');
    $scope.submit = function() {
      var queue = TwitterSearches.create($scope.terms);
      var newSearch = new Search();
      newSearch.$save(
        {},
        function(value) { // create success handler
          queue.id = value.id;
          $http
            .get(prefix + '/twt-searches/start', {
              params: {
                id: value.id,
                terms: queue.terms
              }
            })
            .success(function() {
              Queues.list.push(queue);
              $location.url('/twitter-search/'+queue.slug);
            })
            .error(function() {
              Raven.raven.captureMessage('error starting a new search');
            });
        },
        function() { // create error handler
          Raven.raven.captureMessage('error creating a new search');
        });
    };
  }]);
