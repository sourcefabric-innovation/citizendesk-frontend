'use strict';

angular.module('citizendeskFrontendApp')
  .controller('DebunkedListCtrl', function($scope, SimpleReportList, gettextCatalog, SavedQueries) {
    $scope.description = gettextCatalog.getString('Debunked reports');
    SimpleReportList.init($scope, SavedQueries.getWhere('debunked'));
  });
