'use strict';

angular.module('citizendeskFrontendApp')
  .controller('VerifiedReportsCtrl', function ($scope, api) {
    api.reports
      .query({
        where: '{"verified":true}'
      })
      .then(function(response) {
        $scope.reports = response._items;
      });
  });
