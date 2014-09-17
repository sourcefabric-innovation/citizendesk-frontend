'use strict';

angular.module('citizendeskFrontendApp')
  .controller('SelectMediaToPublishCtrl', function ($scope, api, $routeParams, PageBroker, $location, $window, moveToTheBeginning) {
    var parentPage = '/report-'+$routeParams.type+'/'+$routeParams.id;
    $scope.selected = 0;
    $scope.disabled = true;
    $scope.cancel = function() {
      $window.history.back();
    };
    PageBroker
      .getData(parentPage)
      .then(function(report) {
        $scope.report = report;
        $scope.disabled = false;
      });
    $scope.submit = function() {
      $scope.disabled = true;
      var newReport = angular.copy($scope.report);
      newReport.media = moveToTheBeginning(
        $scope.selected,
        $scope.report.media);
      api.reports
        .save(newReport)
        .then(function() {
          $location.url(parentPage);
        });
    };
  });
