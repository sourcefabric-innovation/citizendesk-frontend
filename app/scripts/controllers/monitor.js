'use strict';
/* jshint camelcase: false */

angular.module('citizendeskFrontendApp')
  .controller('MonitorCtrl', function ($scope, $routeParams, api, Monitors, QueueSelection, linkTweetEntities, AliasesInLists) {
    api.reports
      .query({
        when: JSON.stringify({
          'channels.value': $routeParams.id
        }),
        sort:'[("produced", -1)]'
      })
      .then(function(response) {
        $scope.reports = response._items;
        $scope.reports.forEach(function(report) {
          report.linkedText = linkTweetEntities(report);
          AliasesInLists.embedAuthorAlias(report);
        });
      });
    Monitors.getById($routeParams.id)
      .then(function(monitor) {
        QueueSelection.description = monitor.user_id.username + '\'s monitor';
      });
  });
