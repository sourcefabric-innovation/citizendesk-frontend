'use strict';

angular.module('citizendeskFrontendApp')
  .controller('AssignedListCtrl', function ($scope, SimpleReportList, gettextCatalog) {
    $scope.description = gettextCatalog.getString('Assigned reports');
    SimpleReportList.init($scope, {
      $and: [{
        'assignments.user_id': { $exists: true }
      }, {
        $or: [{
          status: '',
        }, {
          status: {$exists: false}
        }, {
          'coverages.published': { $size: 0 }
        }]
      }]
    }, {
      parameters: { embedded: '{"assignments.user_id": true}' }
    });
    $scope.assign = function(report) {
      PageBroker.load('/assign/', {
        report: report
      });
    };
  });
