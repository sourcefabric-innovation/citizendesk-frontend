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
    $scope.$watch('filterResults', function (oldValue) {
      for (var i in $scope.reports) {
        if (oldValue === 'newest'){
          // order by date
          // is default
        } else {
          // order by activity - to be decided / last changed?
        }
        i++;
      }
    });
    // array options in the verified status select
    $scope.typeOptArr = [
      {'value': 'all', 'text': 'All'},
      {'value': 'tweet', 'text': 'Tweet'},
      {'value': 'sms', 'text': 'SMS'},
      {'value': 'other', 'text': 'Other'}
    ];
    $scope.$watch('typeFilter', function (oldValue) {
      for (var i in $scope.reports) {
        var type = $scope.reports[i].feed_type;
        if (oldValue === 'sms' && type === 'sms'){
          // show me the sms
        }
        if (oldValue === 'tweet' && type === 'tweet'){
          // show me the tweets
        }
        if (oldValue === 'other' && type === undefined){
          // show me the undefined
        }
        if (oldValue === 'all'){
          // show me everything
        }
        i++;
      }
    });
    // array options in the verified status select
    $scope.verOptArr = [
      {'value': 'all', 'text': 'All'},
      {'value': 'ver-y', 'text': 'Verified'},
      {'value': 'ver-n', 'text': 'Unverified'}
    ];
    $scope.$watch('verifiedStatus', function (oldValue) {
      if (oldValue === 'ver-y') {
        // show me the verifed posts
        alterResults(true);
      }
      if (oldValue === 'ver-n') {
        // show me the unverified
      }
      if (oldValue === 'all') {
        // show me everything - default
      }
    });
    // array of options in the published status select
    $scope.pubOptArr = [
      {'value': 'all', 'text': 'All'},
      {'value': 'pub-y', 'text': 'Published'},
      {'value': 'pub-n', 'text': 'Not Published'}
    ];
    $scope.$watch('publishedStatus', function (oldValue) {
      if (oldValue === 'pub-y'){
        // show me the unpublished elements
      }
      if (oldValue === 'pub-n'){
        // show me the published elements
      }
      if (oldValue === 'all'){
        // show me everything
      }
    });
    $scope.dismiss = Report.getDismiss($scope.disabled, function(report) {
      lodash.remove($scope.reports, function(candidate) {
        return candidate._id === report._id;
      });
    });
  });
