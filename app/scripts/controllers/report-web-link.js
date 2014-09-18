'use strict';
/* jshint camelcase: false */

angular.module('citizendeskFrontendApp')
  .controller('ReportWebLinkCtrl', function ($scope, $routeParams, Raven, api, $location, Report, Coverages, $window, screenSize, superdeskDate, PageBroker, SharedReport) {
    SharedReport.get($routeParams.id)
      .property
      .onValue(function(report) {
        $scope.report = report;
        $scope.$watch('report.session', function(newValue) {
          $scope.encodedSession = encodeURIComponent(newValue);
        });
        $scope.$watch('report.texts', function() {
          $scope.hasTranscript = $scope.report.texts[0].transcript;
        }, true);
      });

    $scope.toMediaSelection = function() {
      var r = $scope.report,
          route = '/select-media-to-publish/'+r.feed_type+'/'+r._id;
      PageBroker.load(route, r);
    };
  });
