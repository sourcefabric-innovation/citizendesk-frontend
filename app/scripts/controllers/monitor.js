'use strict';
/* jshint camelcase: false */

angular.module('citizendeskFrontendApp')
  .controller('MonitorCtrl', function ($scope, $routeParams, api, Monitors, QueueSelection, linkTweetEntities, AliasesInLists, Raven) {
    $scope.reports = [];
    api.reports
      .query({
        when: JSON.stringify({
          'channels.value': $routeParams.id
        }),
        sort:'[("produced", -1)]'
      })
      .then(function(response) {
        response._items.forEach(function(report) {
          try {
            report.linkedText = linkTweetEntities(report);
            AliasesInLists.embedAuthorAlias(report);
            // reports that throw an exception above in
            // `linkTweetEntities` will not be added to the
            // scope. this is a workaround for a weird issue with the
            // Eve interface, shortly described in issue #51
            $scope.reports.push(report);
          } catch (e) {
            Raven.raven.captureException(e);
          }
        });
      });
    Monitors.getById($routeParams.id)
      .then(function(monitor) {
        QueueSelection.description = monitor.user_id.username + '\'s monitor';
        $scope.monitor = monitor;
      });
  });
