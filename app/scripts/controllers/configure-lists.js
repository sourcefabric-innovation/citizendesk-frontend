'use strict';

angular.module('citizendeskFrontendApp')
  .controller('ConfigureListsCtrl', function ($scope, api, PageBroker) {
    api.citizen_lists
      .query()
      .then(function(response) {
        $scope.lists = response._items;
      });
    $scope.edit = function(list) {
      PageBroker.load('/configure-lists-specific', list);
    };
    $scope.create = function() {
      PageBroker.load('/configure-lists-specific', 'new');
    };
  });
