'use strict';

angular.module('citizendeskFrontendApp')
  .controller('DebunkedListCtrl', function($scope, SimpleReportList, reportStatuses, gettextCatalog) {
    $scope.description = gettextCatalog.getString('Debunked reports');
    SimpleReportList.init($scope, { status: reportStatuses('debunked') });
  });
