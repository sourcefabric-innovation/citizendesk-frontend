'use strict';
/* jshint camelcase: false */

angular.module('citizendeskFrontendApp')
  .controller('CitizenCardCtrl', function ($scope, $routeParams, api, config, $http) {
    function fetch() {
      var queryParams = {
        where: JSON.stringify({
          'identifiers.user_name': $routeParams.name,
          authority: $routeParams.authority
        })
      };
      api.citizen_aliases
        .query(queryParams)
        .then(function(response) {
          $scope.response = response; // for testing
          var data = response._items;
          if (data.length > 0) {
            $scope.alias = data[0];
          } else {
            $http({
              method: 'POST',
              url: config.server.url + 'proxy/fetch-citizen-alias/',
              data: $routeParams
            })
            .then(function() {
              api.citizen_aliases
                .query(queryParams)
                .then(function(response) {
                  var data = response._items;
                  if (data.length > 0) {
                    $scope.alias = data[0];
                    if (data.length > 1) {
                      throw new Error('multiple aliases for the same user');
                    }
                  } else {
                    throw new Error('zero aliases after fetch request');
                  }
                });
            });
          }
        });
    }
    fetch();
    api.reports
      .query({
        where: JSON.stringify({
          'authors.identifiers.user_name': $routeParams.name,
          'authors.authority': $routeParams.authority
        })
      })
      .then(function(response) {
        $scope.reports = response._items;
      });
  });
