'use strict';

angular.module('citizendeskFrontendApp')
  .controller('AssignedListCtrl', function ($scope, SimpleReportList, gettextCatalog, SavedQueries) {
    $scope.description = gettextCatalog.getString('Assigned reports');
    SimpleReportList.init($scope, SavedQueries.getWhere('assigned'));
  });
