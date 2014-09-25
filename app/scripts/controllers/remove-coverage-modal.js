'use strict';

angular.module('citizendeskFrontendApp')
  .controller('RemoveCoverageModalCtrl', function ($scope, SavedQueries, api) {
    $scope.loading = true;
    $scope.disabled = true;
    api.reports
      .query({
        where: SavedQueries.parametric.publishedIn($scope.coverage.uuid)
      })
      .then(function (response) {
        $scope.reports = response._items;
        $scope.loading = false;
        $scope.disabled = Boolean($scope.reports.length);
      });
  });
