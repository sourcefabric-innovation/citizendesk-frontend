'use strict';
/* jshint camelcase: false */

angular.module('citizendeskFrontendApp')
  .service('Report', function Report(api, session, $q, config, $http, lodash, gettextCatalog, $window) {
    var _ = lodash;
    this.publish = function(report, coverage) {
      var modifiedReport = angular.copy(report),
          deferred = $q.defer();
      api.reports
        .save(modifiedReport, {on_behalf_id: session.identity._id})
        .then(function() {
          $http
            .post(config.server.url + 'proxy/publish', {
              report: report._id,
              coverage: coverage._id
            })
            .then(function() {
              deferred.resolve();
            });
        });
      return deferred.promise;
    };
    this.unpublish = function(report, coverage) {
      return $http.post(config.server.url + 'proxy/unpublish', {
        report: report._id,
        coverage: coverage._id
      });
    };
    this.checkPublished = function(report) {
      if (report.coverages && report.coverages.published) {
        return report.coverages.published.length > 0;
      } else {
        return false;
      }
    };
    this.getSelectedCoverage = function(report, coverages) {
      if (coverages && report.coverages && report.coverages.published) {
        return _.find(coverages, {_id: report.coverages.published[0]});
      }
    };
    // abstraction of an handler needed both on the tweet report
    // controller and on the mobile report controller. get the
    // controller scope, and get also its window because it is tested
    // and mocked at the controller level
    this.getVerificationHandler = function($scope) {
      return function(newValue, oldValue){
        var doNotJump = gettextCatalog.getString('This report was marked as verified, and now it is marked as unverified again! This is a very bad practice, and should be avoided');
        var badVerification = gettextCatalog.getString('This report is being marked as verified without going through the planned verification steps');
        var allDone = $scope.report.steps.every(function(step) {
          return step.done;
        });
        if (newValue === true && allDone === false) {
          $window.alert(badVerification);
        } else if (oldValue === true && newValue === false) {
          $window.alert(doNotJump);
        }
      };
    };
  });
