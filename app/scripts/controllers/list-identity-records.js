'use strict';

angular.module('citizendeskFrontendApp')
  .controller('ListIdentityRecordsCtrl', function ($scope, api, $routeParams, $location, $window) {
    api.identity_records
      .query({
        where: JSON.stringify({
          deleted: {
            $ne: true
          }
        })
      })
      .then(function(response) {
        $scope.identities = response._items;
      });
    $scope.configuration = !$routeParams.aliasId;
    $scope.select = function(identity) {
      var url,
          identityId = identity._id;
      if ($routeParams.aliasId) {
        url = '/associate-alias/'+$routeParams.aliasId+'/'+identityId;
      } else {
        url = '/identity-record/'+identityId;
      }
      $location.url(url);
    };
    $scope.add = function() {
      $location.url('/identity-record/');
    };
    if (!$scope.configuration) {
      api.citizen_aliases
        .getById($routeParams.aliasId)
        .then(function(alias) {
          $scope.dissociate = function() {
            $scope.disabled = true;
            delete alias.identity_record_id;
            api.citizen_aliases
              .replace(alias._links.self.href, alias)
              .then(function() {
                $window.history.back();
              });
          };
        });
    }
  });
