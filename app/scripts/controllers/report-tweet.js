'use strict';
/* jshint camelcase: false */

angular.module('citizendeskFrontendApp')
  .controller('ReportTweetCtrl', function ($scope, $routeParams, Raven, api, $location, Coverages, Report, linkTweetEntities, Bacon, $q, screenSize, superdeskDate) {
    var id = $routeParams.id,
        streams = {
          updateReport: new Bacon.Bus(),
          coveragesData: new Bacon.Bus(),
          reportData: new Bacon.Bus()
        };
    Coverages.promise.then(function (coverages) {
      streams.coveragesData.push(coverages);
    });
    streams.coveragesData.onValue(function(coverages) {
      $scope.coverages = coverages;
    });
    streams.updateReport.onValue(function() {
        api.reports.getById(id)
        .then(function(response) {      
          streams.reportData.push(response);
        });
    });
    streams.reportData.onValue(function(report){
      Report.addSteps(report); // idempotent
      $scope.isPublished = Report.checkPublished(report);
      $scope.report = report;
      $scope.linkedText = linkTweetEntities(report);
      if (report.on_behalf_id) {
        api.users.getById(report.on_behalf_id)
          .then(function(user) {
            $scope.onBehalf = user;
          });
      }
    });
    streams.reportData.take(1).onValue(function(){
      $scope.$watch(
        'report.status',
        Report.getVerificationHandler($scope)
      );
      $scope.$watch(
        'report.steps',
        Report.getStepsHandler($scope)
      );
      $scope.$watch('report.status', function(n, o) {
        if(n === o) {
          return;
        }
        $scope.report.status_updated = superdeskDate.render(new Date());
        $scope.save();
      });
    });

    Bacon
      .combineAsArray(streams.reportData, streams.coveragesData)
      .onValue(function(value) {
        var report = value[0],
            coverages = value[1];
        $scope.selectedCoverage = Report
          .getSelectedCoverage(report, coverages);
      });

    $scope.largeScreen = screenSize.is('md,lg');
    $scope.save = function() {
      $scope.status = 'info';
      $scope.alert = 'saving';
      $scope.disabled = true;

      api.reports.save($scope.report)
        .then(function () {
          $scope.status = 'success';
          $scope.alert = 'saved';
          $scope.disabled = false;
        })
        .catch(function () {
          $scope.status = 'danger';
          $scope.alert = 'error';
        });
    };

    $scope.changeStep = function(checking) {
      if (!checking) {
        alert('A validation step should never be unchecked, if you are unchecking now this means that the validation process was poor. Please be sure to avoid this in the future');
      }
      $scope.save();
    };

    $scope.publish = function() {
      $scope.disablePublish = true;
      Report
        .publish($scope.report, $scope.selectedCoverage)
        .then(function() {
          streams.updateReport.push('start');
          $scope.disablePublish = false;
      });
    };

    $scope.unpublish = function() {
      $scope.disablePublish = true;
      Report
        .unpublish($scope.report, $scope.selectedCoverage)
        .then(function() {
          streams.updateReport.push('start');
          $scope.disablePublish = false;
        });
    };

    streams.updateReport.push('start');
  });
