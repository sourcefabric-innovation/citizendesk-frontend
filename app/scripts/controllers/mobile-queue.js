'use strict';

angular.module('citizendeskFrontendApp')
  .controller('MobileQueueCtrl', ['$scope', 'api', 'QueueSelection', function ($scope, api, QueueSelection) {
    QueueSelection.description = 'Reports coming from mobile phones';
    api.reports
      .query({
        where: '{"feed_type":"sms"}'
      })
      .then(function(reports) {
        $scope.reports = reports._items;
      });
  }]);
