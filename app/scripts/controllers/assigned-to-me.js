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
          // order by activity - to be decided
        }
        i++;
      }
    });
    $scope.$watch('typeFilter', function (oldValue) {
      for (var i in $scope.reports) {
        if (oldValue === 'sms'){
          // just get sms
        } else if (oldValue === 'tweet'){
          // just get tweets
        } else if (oldValue === 'other'){
          // get undefined messages
        } 
        else {
          // gimme the firehose
        }
        i++;
      }
    });
    $scope.$watch('modifyFilter', function (oldValue) {
      for (var i in $scope.reports) {
        if (oldValue === 'and'){
          // filter && published
        } else if (oldValue === 'or'){
          // filter || published
        } else if (oldValue === 'not'){
          // filter !& published
        }
        else {
          // no modifiers
        }
        i++;
      }
    });
    $scope.$watch('publishedStatus', function (oldValue) {
      for (var i in $scope.reports) {
        var published = $scope.reports[i].coverages.published;
        if (oldValue === 'pub-y'){
          // hide out the unpublished elements
          if (published.length === 0) {
            console.log($scope.reports[i]);
          }
        } else if (oldValue === 'pub-n'){
          // hide out the published elements
        }
        else {
          // show everything
        }
        i++;
      }
    });
    $scope.dismiss = Report.getDismiss($scope.disabled, function(report) {
      lodash.remove($scope.reports, function(candidate) {
        return candidate._id === report._id;
      });
    });
  });
