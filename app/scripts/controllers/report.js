'use strict';

angular.module('citizendeskFrontendApp')
  .controller('ReportCtrl', ['$scope', '$routeParams', 'Raven', 'Resources', 'prefix', '$location', '$anchorScroll', function ($scope, $routeParams, Raven, Resources, prefix, $location, $anchorScroll) {
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
        Resources.steps.query()
          .$promise
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

    Resources.reports
      .get({id:id})
      .$promise
      .then(function(data) {
        $scope.report = data;
        addSteps($scope.report);
        $scope.$watch('report.verified', function(newValue, oldValue) {
          if (oldValue === true && newValue === false) {
            alert('this report was marked as verified, and now it is marked as unverified again! this is a very bad practice, and should be avoided');
          }
          $scope.stepsDisabled = $scope.report.verified;
        });
      });

    $scope.save = function() {
      $scope.status = 'info';
      $scope.alert = 'saving';

      $scope.report
        .$save()
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
  }]);
