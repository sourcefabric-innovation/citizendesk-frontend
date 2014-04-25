'use strict';

angular.module('citizendeskFrontendApp')
  .controller('ReportCtrl', ['$scope', '$routeParams', '$sails', 'Raven', '$log', 'SocketsHelpers', function ($scope, $routeParams, $sails, Raven, $log, SocketsHelpers) {
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
        $log.debug('keeping existent report steps');
        watchSteps();
      } else {
        $sails
          .get('/steps')
          .success(function(data) {
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
    $sails
      .get('/reports?id='+id)
      .success(function(data) {
        if (data.length === 0) {
          Raven.raven.captureMessage('empty return set for report detail. report id: '+id);
        } else {
          $scope.report = data;
          addSteps($scope.report);
          $scope.$watch('report.verified', function(newValue, oldValue) {
            if (oldValue === true && newValue === false) {
              alert('this report was marked as verified, and now it is marked as unverified again! this is a very bad practice, and should be avoided');
            }
            $scope.stepsDisabled = $scope.report.verified;
          });
        }
      })
      .error(function(data) {
        Raven.captureSocketError(data);
      });
    $scope.save = function() {
      $scope.status = 'info';
      $scope.alert = 'saving';
      SocketsHelpers
        .save($scope.report, '/reports/')
        .success(function () {
          $scope.status = 'success';
          $scope.alert = 'saved';
        })
        .error(function () {
          $scope.status = 'error';
          $scope.alert = 'error';
        });
    };
    $scope.changeStep = function(checking) {
      if (!checking) {
        alert('A validation step should never be unchecked, if you are unchecking now this means that the validation process was poor. Please be sure to avoid this in the future');
      }
      $scope.save();
    };
  }]);
