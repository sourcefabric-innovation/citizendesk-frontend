'use strict';

angular.module('citizendeskFrontendApp')
  .controller('WebQueueCtrl', ['$scope', 'Resources', 'QueueSelection', function ($scope, Resources, QueueSelection) {
    QueueSelection.description = 'Reports coming from the web interface';
    $scope.reports = Resources.reports.query({
      where: '{"channels.type":"web"}'
    });
  }]);
