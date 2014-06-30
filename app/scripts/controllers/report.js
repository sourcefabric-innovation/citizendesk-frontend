'use strict';

angular.module('citizendeskFrontendApp')
  .controller('ReportCtrl', ['$scope', '$routeParams', 'Raven', 'api', '$location', '$anchorScroll', function ($scope, $routeParams, Raven, api, $location, $anchorScroll) {
    var id = $routeParams.id;

    function watchSteps() {
      $scope.$watch('report.steps', function() {
        $scope.wait = $scope.report.steps.some(function(step) {
          return !step.done;
        });
      }, true);
    }

    function addSteps(report) {
      if ('steps' in report) {
        watchSteps();
      } else {
        api.steps.query()
          .then(function(data) {
            if (data.length === 0) {
              Raven.raven.captureMessage('no validation steps for report detail');
            } else {
              report.steps = data.map(function(step) {
                step.done = false;
                return step;
              });
              watchSteps();
            }
          });
      }
    }


    api.reports
      .getById(id)
      .then(function(data) {
        $scope.report = data;
        addSteps($scope.report);

        $scope.$watch('report.verified', function(newValue, oldValue) {
          if (oldValue === true && newValue === false) {
            alert('this report was marked as verified, and now it is marked as unverified again! this is a very bad practice, and should be avoided');
          }
          $scope.stepsDisabled = $scope.report.verified;
        });

        $scope.$watch('report.texts', function(newValue, oldValue) {
          $scope.hasTranscript = $scope.report.texts[0].transcript;
        }, true);
      });

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
        })
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
        })
    };

  }]);
