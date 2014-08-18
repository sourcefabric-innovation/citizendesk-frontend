'use strict';

angular.module('citizendeskFrontendApp')
  .controller('DismissedListCtrl', function ($scope, SimpleReportList, reportStatuses, gettextCatalog) {
    $scope.description = gettextCatalog.getString('Dismissed reports');
    SimpleReportList.init($scope, { status: reportStatuses('dismissed') });
  });
