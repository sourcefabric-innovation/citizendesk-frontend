'use strict';
/* jshint camelcase: false */

angular.module('citizendeskFrontendApp')
  .controller('ReportWebLinkCtrl', function ($scope, $routeParams, Raven, api, $location, Report, Coverages, $window, screenSize, superdeskDate, PageBroker) {
    var id = $routeParams.id;

    function updateReport() {
      return api.reports
        .getById(id)
        .then(function(report) {
          $scope.report = report;
          Report.addSteps($scope.report);
          $scope.selectedCoverage = Report
            .getSelectedCoverage(report, $scope.coverages);
          if (report.on_behalf_id) {
            api.users.getById(report.on_behalf_id)
              .then(function(user) {
                $scope.onBehalf = user;
              });
          }
        });
    }
    
    updateReport().then(function() {

      $scope.$watch('report.coverages', function() {
        $scope.isPublished = Report.checkPublished($scope.report);
      }, true);

      $scope.$watch('report.session', function(newValue) {
        $scope.encodedSession = encodeURIComponent(newValue);
      });

      $scope.$watch('report.status', Report.getVerificationHandler($scope));
      $scope.$watch('report.steps', Report.getStepsHandler($scope));

      $scope.$watch('report.status', function(n, o) {
        if(n === o) {
          return;
        }
        $scope.report.status_updated = superdeskDate.render(new Date());
        $scope.save();
      });
    });

    $scope.api = api; // expose for mocking in tests
    
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
    $scope.deleteSummary = function() {
      // no need to set it to false again. we will either have an
      // error or go back in the browser history
      $scope.deleteSummaryDisabled = true;
      api.reports
        .remove($scope.report)
        .then(function(){
          $window.history.back();
        });
    };
    $scope.toMediaSelection = function() {
      var r = $scope.report,
          route = '/select-media-to-publish/'+r.feed_type+'/'+r._id;
      PageBroker.load(route, r);
    };
  });
