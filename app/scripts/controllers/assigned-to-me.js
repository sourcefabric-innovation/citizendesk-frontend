'use strict';

/* jshint camelcase: false */

angular.module('citizendeskFrontendApp')
  .controller('AssignedToMeCtrl', function ($scope, api, session, Report, lodash, AliasesInLists, allPages) {
    $scope.reports = [];
    $scope.disabled = {};
    $scope.loading = true;
    allPages(function (page) {
      return api.reports
        .query({
          where: JSON.stringify({
            $and: [{
              'assignments.user_id': session.identity._id
            }, {
              $or: [{
                status: '',
              }, {
                status: {$exists: true}
              }, {
                'coverages.published': { $size: 1 }
              }]
            }]
          }),
          page: page,
          sort: '[("produced", -1)]'
        })
        .then(function(response) {
          var reports = [];
          lodash.forEach(response._items, function(report) {
            if (report.coverages.published.length > 0) {
              report.published = true;
            } else {
              report.published = false;
            }
            if (report.status === '') {
              report.status = 'tbd';
            }
            reports.push(report);
          });
          console.log(reports);
          Report.linkTweetTextsInList(reports);
          reports.map(AliasesInLists.embedAuthorAlias);
          $scope.reports = $scope.reports.concat(reports);
          return response;
        });
    })
    .then(function() {
      $scope.loading = false;
    });
    // array options in the verified status select
    $scope.filterOptArr = [
      {'value': 'newest', 'text': 'Newest'},
      {'value': 'active', 'text': 'Most Active'}
    ];
    // array options in the verified status select
    $scope.typeOptArr = [
      {'value': 0, 'text': 'All'},
      {'value': 'tweet', 'text': 'Tweet'},
      {'value': 'sms', 'text': 'SMS'},
      {'value': 'other', 'text': 'Other'}
    ];
    // array options in the verified status select
    $scope.verOptArr = [
      {'value': 0, 'text': 'All'},
      {'value': 'verified', 'text': 'Verified'},
      {'value': 'debunked', 'text': 'Debunked'},
      {'value': 'tbd', 'text': 'Unverified'}
    ];
    // array of options in the published status select
    $scope.pubOptArr = [
      {'value': '', 'text': 'All'},
      {'value': {'published': true}, 'text': 'Published'},
      {'value': {'published': false}, 'text': 'Not Published'}
    ];
    $scope.dismiss = Report.getDismiss($scope.disabled, function(report) {
      lodash.remove($scope.reports, function(candidate) {
        return candidate._id === report._id;
      });
    });
  });
