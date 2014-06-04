'use strict';

angular.module('citizendeskFrontendApp')
  .controller('NewTwitterSearchCtrl', ['TwitterSearches', '$scope', '$location', function (TwitterSearches, $scope, $location) {
    $scope.submit = function() {
      TwitterSearches
        .create($scope.terms)
        .then(function (id) {
          $location.url('/twitter-search/' + id);
        });
    };
  }]);
