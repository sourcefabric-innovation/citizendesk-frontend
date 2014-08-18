'use strict';

angular.module('citizendeskFrontendApp')
  .controller('PublishedListCtrl', function ($scope, SimpleReportList, gettextCatalog) {
    $scope.description = gettextCatalog.getString('Published reports');
    var query = {
      'coverages.published': {
        // in order to specify a not empty array
        $elemMatch: {
          $exists: true
        }
      }
    };
    SimpleReportList.init($scope, query);
  });
