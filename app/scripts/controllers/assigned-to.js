'use strict';

angular.module('citizendeskFrontendApp')
  .controller('AssignedToCtrl', function ($scope, $routeParams, SimpleReportList, gettextCatalog) {
    $scope.description =
      gettextCatalog.getString('Assigned to ') +
      $routeParams.name;
    SimpleReportList.init($scope, {
      $and: [{
        'assignments.user_id': $routeParams.id
      }, {
        $or: [{
          status: '',
        }, {
          status: {$exists: false}
        }, {
          'coverages.published': { $size: 0 }
        }]
      }]
    });
  });
