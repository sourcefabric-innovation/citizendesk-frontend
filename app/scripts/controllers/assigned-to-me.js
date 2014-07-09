'use strict';

angular.module('citizendeskFrontendApp')
  .controller('AssignedToMeCtrl', function ($scope, api, session) {
    $scope.reports = [];
    function fetch(page) {
      api.reports
        .query({
          where: JSON.stringify({
            'assignments.user_id': session.identity._id
          }),
          page: page,
          sort: '[("produced", -1)]'
        })
        .then(function(response) {
          $scope.reports = $scope.reports.concat(response._items);
          if (response._links.next) {
            fetch(page + 1);
          }
        });
    }
    fetch(1);
  });
