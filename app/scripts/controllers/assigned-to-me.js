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
          var reports = response._items;
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
      {'value': '', 'text': 'Unverified'}
    ];
    // array of options in the published status select
    $scope.pubOptArr = [
      {'value': '', 'text': 'All'},
      {'value': 'pub-y', 'text': 'Published'},
      {'value': 'pub-n', 'text': 'Not Published'}
    ];
    $scope.$watch('published', function(oldValue){
      for (var i in $scope.reports){
        var report = $scope.reports[i];
        var published = report.coverages.published.length;
        if (oldValue === 'pub-y') {
          return (published === 1);
        }
        if (oldValue === 'pub-n') {
          return (published === 0);
        }
        if (oldValue === '') {
          return ($scope.reports);
        }
        i++;
      }
    });

    // $scope.published = function (report) {
    //   return (report.published === 0 && report.published === 'pub-n');
    // };
    $scope.dismiss = Report.getDismiss($scope.disabled, function(report) {
      lodash.remove($scope.reports, function(candidate) {
        return candidate._id === report._id;
      });
    });
  });
