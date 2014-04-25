'use strict';
/* jshint eqeqeq:false */

angular.module('citizendeskFrontendApp')
  .controller('VerifiedReportsCtrl', ['$scope', '$sails', function ($scope, $sails) {
    $sails
      .get('/reports?verified=true&limit=100&sort=created%20DESC')
      .success(function(data) {
        $scope.reports = data;
      });
    $sails
      .on('message', function (message) {
        var isReport = message.model == 'reports',
        isNew = message.verb == 'create',
        isVerified = message.data.verified;
      if (isReport && isNew && isVerified) {
        $scope.reports.unshift(message.data);
      }
    });
  }]);
