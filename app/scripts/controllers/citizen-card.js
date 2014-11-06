'use strict';
/* jshint camelcase: false */

angular.module('citizendeskFrontendApp')
  .controller('CitizenCardCtrl', function ($scope, $routeParams, api, config, $http, PageBroker, $location, linkTweetEntities, Raven) {
    $scope.aliasesHandler = function(response) {
      var items = response._items,
          length = items.length;
      $scope.response = response; // for testing
      if (length > 0) {
        $scope.alias = items[0];
        if (length > 1) {
          throw new Error('multiple aliases for the same user');
        }
      }
      return length > 0;
    };
    $scope.getAliases = function() {
      return api.citizen_aliases
        .query({
          where: JSON.stringify({
            'identifiers.user_name': $routeParams.id,
            authority: $routeParams.authority
          }),
          embedded: '{"tags": 1, "identity_record_id":1}'
        })
        .then($scope.aliasesHandler);
    };
    $scope
      .getAliases()
      .then(function(success) {
        if (success) {
          return;
        }
        // else, create the alias
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
        creation.then($scope.getAliases);
      });
    api.reports
      .query({
        where: JSON.stringify({
          'authors.identifiers.user_name': $routeParams.id,
          'authors.authority': $routeParams.authority
        })
      })
      .then(function(response) {
        $scope.reports = response._items;
        $scope.reports.forEach(function(report) {
          if (report.feed_type === 'tweet') {
            report.linkedText = linkTweetEntities(report);
          }
        });
      });
    $scope.editTags = function() {
      PageBroker.load('/edit-user-lists', $scope.alias);
    };
    $scope.associate = function() {
      $location.url('/list-identity-records/'+$scope.alias._id);
    };
  });
