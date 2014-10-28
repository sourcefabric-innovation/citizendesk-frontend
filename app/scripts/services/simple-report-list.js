'use strict';

angular.module('citizendeskFrontendApp')
  .service('SimpleReportList', function(api, Report, PageBroker, allPages) {
    this.init = function($scope, query, options) {
      var parameters = {};
      if (options && options.parameters) {
        parameters = options.parameters;
      }
      $scope.assign = function(report) {
        PageBroker.load('/assign/', {
          report: report
        });
      };
      $scope.reports = [];
      parameters.where = JSON.stringify(query);
      parameters.sort = '[("produced", -1)]';
      parameters.embedded = '{"assignments.user_id": true}';
      return allPages(function(page){
        $scope.loading = true;
        parameters.page = page;
        return api.reports
          .query(parameters)
          .then(function(response){
            Report.linkTweetTextsInList(response._items);
            $scope.reports = $scope.reports.concat(response._items);
            return response;
          });
      })
      .then(function() {
        $scope.loading = false;
      });
    };
  });
