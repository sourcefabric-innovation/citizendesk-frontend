'use strict';

angular.module('citizendeskFrontendApp')
  //.controller('ConfigureTwitterIngestionOauthsCtrl', ['$scope', function ($scope) {
  .controller('ConfigureTwitterIngestionOauthsCtrl', ['resource', 'prefix', '$scope', function (resource, prefix, $scope) {
    var res = resource(prefix + '/twt_oauths/:id');
    $scope.twtOauths = res.query();
  }]);
