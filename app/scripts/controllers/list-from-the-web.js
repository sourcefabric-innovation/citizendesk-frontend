'use strict';

angular.module('citizendeskFrontendApp')
  .controller('ListFromTheWebCtrl', function ($scope, SimpleReportList, gettextCatalog, $location, Report, lodash, reportStatuses) {
    $scope.description = gettextCatalog.getString('Content from the Web');
    $scope.disabled = {}; // for the dismiss function
    $scope.goAdd = function() {
          $location.url('/ingest-from-location/');
    };
    SimpleReportList
      .init($scope, {
        $and: [{
          'channels.type': 'frontend'
        }, {
          'feed_type': 'web_link'
        }, {
          status: reportStatuses('')
        }, {
          assignments: {$size: 0}
        }]
      })
      .then(function() {
        if ($scope.reports.length === 0) {
          $scope.goAdd();
        }
      });
    $scope.dismiss = Report.getDismiss($scope.disabled, function(report) {
      lodash.remove($scope.reports, function(candidate) {
        return candidate._id === report._id;
      });
    });
  });
