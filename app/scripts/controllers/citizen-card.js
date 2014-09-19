'use strict';
/* jshint camelcase: false */

angular.module('citizendeskFrontendApp')
  .controller('CitizenCardCtrl', function ($scope, $routeParams, api, config, $http, PageBroker) {
    function fetch() {
      var queryParams = {
        where: JSON.stringify({
          'identifiers.user_name': $routeParams.id,
          authority: $routeParams.authority
        }),
        embedded: '{"tags": 1}'
      };
      api.citizen_aliases
        .query(queryParams)
        .then(function(response) {
          $scope.response = response; // for testing
          var data = response._items;
          if (data.length > 0) {
            $scope.alias = data[0];
          } else {
            var authority = $routeParams.authority,
                id        = $routeParams.id,
                creation;
            if (authority === 'citizen_desk') {
              creation = api.users
                .getById(id)
                .then(function(user) {
                  return api.citizen_aliases.save({
                    authority: authority,
                    identifiers: {
                      user_id: user.id,
                      user_id_search: user.id,
                      user_name: user.username
                    },
                    tags: [],
                    avatars: []
                  });
                });
            } else {
              creation = $http({
                method: 'POST',
                url: config.server.url + 'proxy/fetch-citizen-alias/',
                data: {
                  authority: authority,
                  name: id
                }
              });
            }
            creation.then(function() {
              api.citizen_aliases
                .query(queryParams)
                .then(function(response) {
                  var data = response._items;
                  if (data.length > 0) {
                    $scope.alias = data[0];
                    if (data.length > 1) {
                      throw new Error('multiple aliases for the same user');
                    }
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
          'authors.identifiers.user_name': $routeParams.id,
          'authors.authority': $routeParams.authority
        })
      })
      .then(function(response) {
        $scope.reports = response._items;
      });
    $scope.editTags = function() {
      PageBroker.load('/edit-user-lists', $scope.alias);
    };
  });
