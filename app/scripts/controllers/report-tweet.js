'use strict';
/* jshint camelcase: false */

angular.module('citizendeskFrontendApp')
  .controller('ReportTweetCtrl', function ($scope, $routeParams, Raven, api, $location, Coverages, Report, linkTweetEntities, Bacon, $q, screenSize, superdeskDate, SharedReport) {
    SharedReport
      .get($routeParams.id)
      .property
      .onValue(function(report) {
        $scope.report = report;
        $scope.linkedText = linkTweetEntities(report);
      });
  });
