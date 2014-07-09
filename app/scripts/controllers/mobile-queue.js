'use strict';

angular.module('citizendeskFrontendApp')
  .controller('MobileQueueCtrl', function ($scope, api, QueueSelection) {
    QueueSelection.description = 'Reports coming from mobile phones';
    $scope.reports = [];
    function fetch(page) {
      api.reports
        .query({
          where: '{"feed_type":"sms"}',
          sort: '[("produced", -1)]',
          page: page
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
