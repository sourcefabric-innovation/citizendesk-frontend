'use strict';

angular.module('citizendeskFrontendApp')
  .controller('PublishedListCtrl', function ($scope, SimpleReportList, gettextCatalog, SavedQueries) {
    $scope.description = gettextCatalog.getString('Published reports');
    SimpleReportList.init($scope, SavedQueries.getWhere('published'));
  });
