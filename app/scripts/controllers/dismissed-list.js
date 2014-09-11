'use strict';

angular.module('citizendeskFrontendApp')
  .controller('DismissedListCtrl', function ($scope, SimpleReportList, gettextCatalog, SavedQueries) {
    $scope.description = gettextCatalog.getString('Dismissed reports');
    SimpleReportList.init($scope, SavedQueries.getWhere('dismissed'));
  });
