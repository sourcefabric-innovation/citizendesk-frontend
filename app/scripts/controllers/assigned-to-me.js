'use strict';

/* jshint camelcase: false */

angular.module('citizendeskFrontendApp')
  .controller('AssignedToMeCtrl', function ($scope, api, session, linkTweetEntities, Raven) {
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
          var reports = response._items;
          reports.forEach(function(report) {
            if (report.feed_type === 'tweet') {
              try {
                report.linkedText = linkTweetEntities(report);
              } catch (exception) {
                Raven.raven.captureException(exception);
              }
            }
          });
          $scope.reports = $scope.reports.concat(reports);
          if (response._links.next) {
            fetch(page + 1);
          }
        });
    }
    fetch(1);
  });
