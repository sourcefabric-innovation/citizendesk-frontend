'use strict';

angular.module('citizenfrontApp')
  .controller('ConfigureTwitterIngestionFiltersCtrl', ['$scope', '$sails', function ($scope, $sails) {
    $sails
      .get('/twt_filters')
      .success(function(data) {
        $scope.twtFilters = data;
      });
  }]);
