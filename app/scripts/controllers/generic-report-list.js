'use strict';

angular.module('citizendeskFrontendApp')
  .controller('GenericReportListCtrl', function ($scope, SavedQueries, $routeParams, SimpleReportList, gettextCatalog) {
    $scope.description = gettextCatalog.getString('Matching reports');
    SimpleReportList.init($scope, SavedQueries.getWhere($routeParams.query));
  });
