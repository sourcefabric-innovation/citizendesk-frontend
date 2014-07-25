'use strict';
/* jshint camelcase: false */

angular.module('citizendeskFrontendApp')
  .controller('ReportSmsCtrl', function ($scope, $routeParams, Raven, api, $location, $anchorScroll, Report, Coverages, $window) {
    var id = $routeParams.id;

    function addSteps(report) {
      if (!('steps' in report)) {
        api.steps.query()
          .then(function(response) {
            var data = response._items;
            if (data.length === 0) {
              Raven.raven.captureMessage('no validation steps for report detail');
            } else {
              report.steps = data.map(function(step) {
                step.done = false;
                return step;
              });
            }
          });
      }
    }

    function updateReport() {
      var promise = api.reports.getById(id);
      promise.then(function(report) {
        $scope.report = report;
        $scope.selectedCoverage = Report
          .getSelectedCoverage(report, $scope.coverages);
        if (report.on_behalf_id) {
          api.users.getById(report.on_behalf_id)
            .then(function(user) {
              $scope.onBehalf = user;
            });
        }
      });
      return promise;
    }
    
    updateReport().then(function() {
      addSteps($scope.report);

      $scope.$watch('report.steps', function() {
        if ($scope.report.steps) {
          $scope.wait = $scope.report.steps.some(function(step) {
            return !step.done;
          });
        }
      }, true);

      $scope.$watch('report.coverages', function() {
        $scope.isPublished = Report.checkPublished($scope.report);
      }, true);

      $scope.$watch('report.session', function(newValue) {
        $scope.encodedSession = encodeURIComponent(newValue);
      });

      $scope.$watch('report.verified', function(newValue, oldValue) {
        if (oldValue === true && newValue === false) {
          alert('this report was marked as verified, and now it is marked as unverified again! this is a very bad practice, and should be avoided');
        }
        $scope.stepsDisabled = $scope.report.verified;
      });

      $scope.$watch('report.texts', function() {
        $scope.hasTranscript = $scope.report.texts[0].transcript;
      }, true);
    });

    $scope.api = api; // expose for mocking in tests
    
    $scope.save = function() {
      $scope.status = 'info';
      $scope.alert = 'saving';

      api.reports.save($scope.report)
        .then(function () {
          $scope.status = 'success';
          $scope.alert = 'saved';
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

    // see https://github.com/mgcrea/angular-strap/issues/573
    $scope.scrollTo = function (id){
      // set the location.hash to the id of
      // the element you wish to scroll to.
      $location.hash(id);
      // call $anchorScroll()
      $anchorScroll();
    };

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
          $scope.report = report;
        });
    };

    $scope.discardTranscript = function() {
      $scope.disableTranscript = true;
      var texts = angular.copy($scope.report.texts);
      texts[0].transcript = undefined;
      api.reports
        .update($scope.report, {texts: texts})
        .then(function(report) {
          $scope.disableTranscript = false;
          $scope.report = report;
        });
    };

    Coverages.promise.then(function(coverages) {
      $scope.coverages = coverages;
    });

    $scope.publish = function() {
      $scope.disablePublish = true;
      Report
        .publish($scope.report, $scope.selectedCoverage)
        .then(function() {
          updateReport();
          $scope.disablePublish = false;
      });
    };

    $scope.unpublish = function() {
      $scope.disablePublish = true;
      Report
        .unpublish($scope.report, $scope.selectedCoverage)
        .then(function() {
          updateReport();
          $scope.disablePublish = false;
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
        });
    };
  });
