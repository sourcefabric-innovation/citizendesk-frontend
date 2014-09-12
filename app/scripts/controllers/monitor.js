'use strict';
/* jshint camelcase: false */

angular.module('citizendeskFrontendApp')
  .controller('MonitorCtrl', function ($scope, $routeParams, api, Monitors, QueueSelection, linkTweetEntities, AliasesInLists, Raven) {
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
          try {
            report.linkedText = linkTweetEntities(report);
          } catch (e) {
            Raven.raven.captureException(e);
          }
          AliasesInLists.embedAuthorAlias(report);
        });
      });
    Monitors.getById($routeParams.id)
      .then(function(monitor) {
        QueueSelection.description = monitor.user_id.username + '\'s monitor';
        $scope.monitor = monitor;
      });
  });
