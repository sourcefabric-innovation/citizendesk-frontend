'use strict';

angular.module('citizendeskFrontendApp')
  .controller('AssociateAliasCtrl', function ($scope, $window, $routeParams, api, $q) {
    $scope.loading = true;
    $q
      .all([
        api.citizen_aliases
          .getById($routeParams.aliasId)
          .then(function(alias) {
            $scope.alias = alias;
          }),
        api.identity_records
          .getById($routeParams.identityId)
          .then(function(identity) {
            $scope.identity = identity;
          })
      ])
      .then(function() {
        $scope.loading = false;
      });
    $scope.cancel = function() {
      $window.history.back();
    };
    $scope.confirm = function() {
      var newAlias = angular.copy($scope.alias);
      newAlias.identity_record_id = $routeParams.identityId;
      $scope.disabled = true;
      api.citizen_aliases
        .save(newAlias)
        .then(function() {
          $scope.disabled = false;
          $window.history.go(-2);
        });
    };
  });
