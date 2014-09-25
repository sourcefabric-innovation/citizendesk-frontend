'use strict';
/* jshint camelcase: false */

angular.module('citizendeskFrontendApp')
  .controller('ReportSmsCtrl', function ($scope, $routeParams, Raven, api, $location, Report, Coverages, $window, screenSize, superdeskDate, SharedReport) {
    var shared = SharedReport.get($routeParams.id);
    shared
      .property
      .onValue(function(report) {
        $scope.report = report;
        $scope.encodedSession = encodeURIComponent(report.session);
        $scope.hasTranscript = Boolean($scope.report.texts[0].transcript);
      });

    $scope.startTranscript = function() {
      var initial;
      if ($scope.hasTranscript) {
        initial = $scope.report.texts[0].transcript;
      } else {
        initial = angular
          .copy($scope.report.texts[0].original);
      }
      $scope.transcriptCandidate = initial;
      $scope.editingTranscript = true;
    };

    $scope.cancelTranscriptEditing = function() {
      $scope.editingTranscript = false;
    };

    $scope.saveTranscript = function() {
      $scope.disableTranscript = true;
      var texts = angular.copy($scope.report.texts);
      texts[0].transcript = $scope.transcriptCandidate;
      api.reports
        .update($scope.report, {texts: texts})
        .then(function(report) {
          $scope.disableTranscript = false;
          $scope.editingTranscript = false;
          shared.stream.push(report);
        });
    };

    $scope.discardTranscript = function() {
      $scope.disableTranscript = true;
      var texts = angular.copy($scope.report.texts);
      delete texts[0].transcript;
      api.reports
        .update($scope.report, {texts: texts})
        .then(function(report) {
          $scope.disableTranscript = false;
          shared.stream.push(report);
        });
    };

    $scope.deleteSummary = function(){
      // no need to set it to false again. we will either have an
      // error or go back in the browser history
      $scope.deleteSummaryDisabled = true;
      api.reports
        .remove($scope.report)
        .then(function(){
          $window.history.back();
          // controllers looking for this will have to ask for a new
          // value, and they will get an error
          shared.remove();
        });
    };
  });
