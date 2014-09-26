'use strict';

angular.module('citizendeskFrontendApp')
  .controller('ListIdentityRecordsCtrl', function ($scope, api, $routeParams, $location) {
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
    $scope.configurationNavigation = !$routeParams.aliasId;
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
  });
