'use strict';

angular.module('citizendeskFrontendApp')
  .controller('TwitterSearchCtrl', function ($scope, TwitterSearches, $routeParams, $location, QueueSelection, PageBroker, linkTweetEntities, AliasesInLists, ScrollTo) {
    $scope.queue = {};
    $scope.loading = true;
    function checkUpdate() {
      var returned = PageBroker.getReturnedData();
      if (returned && returned.updateId) {
        ScrollTo.targetStream.push(returned.updateId);
        TwitterSearches.refreshReport($routeParams.id, returned.updateId);
      }
    }
    function processReport(report) {
      report.linkedText = linkTweetEntities(report);
      AliasesInLists.embedAuthorAlias(report);
    }
    TwitterSearches
      .byId($routeParams.id)
      .then(function(queue) {
        if (queue) {
          checkUpdate();
          QueueSelection.description = queue.description;
          queue.reports.forEach(processReport);
          $scope.queue  = queue;
        } else {
          $location.url('/error-no-searches');
        }
      })
      .then(function() {
        $scope.loading = false;
      });
    $scope.delete = function() {
      $scope.status = 'deleting';
      TwitterSearches
        .delete($scope.queue)
        .then(function() { $scope.status = 'deleted'; })
        .catch(function() { $scope.status = 'error'; });
    };
    $scope.assign = function(report) {
      PageBroker.load('/assign/', {
        report: report
      });
    };
  });
