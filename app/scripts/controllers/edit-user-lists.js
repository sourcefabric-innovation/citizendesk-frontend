'use strict';

angular.module('citizendeskFrontendApp')
  .controller('EditUserListsCtrl', function ($scope, api, PageBroker, $window, AliasesInLists) {
    PageBroker
      .getData('/')
      .then(function(alias) {
        $scope.alias = alias;
        var list = alias.tags[0];
        $scope.currentList = list._id;
      });
    api.citizen_lists
      .query()
      .then(function(response) {
        if (response._items.length) {
          $scope.lists = response._items;
        } else {
          $scope.noLists = true;
        }
      });
    $scope.save = function() {
      $scope.disabled = true;
      if ($scope.currentList) {
        $scope.alias.tags = [ $scope.currentList ];
      } else {
        $scope.alias.tags = [];
      }
      api.citizen_aliases
        .save($scope.alias)
        .then(function() {
          $window.history.back();
          AliasesInLists.update();
        });
    };
  });
