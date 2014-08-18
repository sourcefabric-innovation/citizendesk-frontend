'use strict';

angular.module('citizendeskFrontendApp')
  .service('SimpleReportList', function(api, Report) {
    this.init = function($scope, query, options) {
      var parameters = {};
      if (options && options.parameters) {
        parameters = options.parameters;
      }
      $scope.reports = [];
      parameters.where = JSON.stringify(query);
      parameters.sort = '[("produced", -1)]';
      function fetch(page){
        $scope.loading = true;
        parameters.page = page;
        api.reports
          .query(parameters)
          .then(function(response){
            Report.linkTweetTextsInList(response._items);
            $scope.reports = $scope.reports.concat(response._items);
            if (response._links.next){
              fetch(page + 1);
            } else {
              $scope.loading = false;
            }
          });
      }
      fetch(1);
    };
  });
