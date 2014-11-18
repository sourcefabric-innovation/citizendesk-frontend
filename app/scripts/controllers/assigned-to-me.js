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
                status: {$exists: false}
              }, {
                verified: '',
              }, {
                verified: 'verified'
              }, {
                type: ''
              }, {
                type: 'tweet'
              }, {
                type: 'sms'
              }, {
                type: 'other'
              }, {
                'coverages.published': { $size: 0 }
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
    $scope.$watch('filterResults');
    // array options in the verified status select
    $scope.typeOptArr = [
      {'value': 0, 'text': 'All'},
      {'value': 'tweet', 'text': 'Tweet'},
      {'value': 'sms', 'text': 'SMS'},
      {'value': 'other', 'text': 'Other'}
    ];
    $scope.$watch('typeFilter');
    // array options in the verified status select
    $scope.verOptArr = [
      {'value': 0, 'text': 'All'},
      {'value': 'verified', 'text': 'Verified'},
      {'value': null, 'text': 'Unverified'}
    ];
    $scope.$watch('verifiedStatus');
    // array of options in the published status select
    $scope.pubOptArr = [
      {'value': 0, 'text': 'All'},
      {'value': 1, 'text': 'Published'},
      {'value': 2, 'text': 'Not Published'}
    ];
    $scope.$watch('publishedStatus');
    $scope.dismiss = Report.getDismiss($scope.disabled, function(report) {
      lodash.remove($scope.reports, function(candidate) {
        return candidate._id === report._id;
      });
    });
  });
