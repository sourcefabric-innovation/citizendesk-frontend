'use strict';
/* jshint camelcase: false */

angular.module('citizendeskFrontendApp')
  .service('Report', function Report(api, session, $q, config, $http, lodash) {
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
  });
