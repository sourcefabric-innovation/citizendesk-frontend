'use strict';

angular.module('citizendeskFrontendApp')
  .controller('EditUserListsCtrl', function ($scope, api, PageBroker, $window, AliasesInLists) {
    PageBroker
      .getData('/')
      .then(function(alias) {
        $scope.alias = alias;
        var list = alias.tags[0];
        if (list) {
          $scope.currentList = list._id;
        } else {
          $scope.currentList = false;
        }
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
      var toBeSaved = angular.copy($scope.alias);
      // cancel the embedding before saving
      toBeSaved.identity_record_id = toBeSaved.identity_record_id._id;
      api.citizen_aliases
        .save(toBeSaved)
        .then(function() {
          $window.history.back();
          AliasesInLists.update();
        });
    };
  });
