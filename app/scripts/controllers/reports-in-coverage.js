'use strict';

angular.module('citizendeskFrontendApp')
  .controller('ReportsInCoverageCtrl', function ($scope, SimpleReportList, SavedQueries, gettextCatalog, $routeParams) {
    $scope.description = gettextCatalog
      .getString('Reports published in the coverage');
    SimpleReportList.init(
      $scope,
      SavedQueries.parametric.publishedIn($routeParams.uniqueId)
    );
  });
