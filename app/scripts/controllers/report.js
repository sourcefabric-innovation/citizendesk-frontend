'use strict';

angular.module('citizendeskFrontendApp')
  .controller('ReportCtrl', ['$scope', '$routeParams', '$sails', 'Raven', function ($scope, $routeParams, $sails, Raven) {
    var id = $routeParams.id;
    $sails
      .get('/reports?id='+id)
      .success(function(data) {
        if (data.length === 0) {
          Raven.raven.captureMessage('empty return set for report detail. report id: '+id);
        } else {
          $scope.report = data;
        }
      })
      .error(function(data) {
        Raven.captureSocketError(data);
      });
  }]);
