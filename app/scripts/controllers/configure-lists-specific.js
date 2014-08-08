'use strict';

angular.module('citizendeskFrontendApp')
  .controller('ConfigureListsSpecificCtrl', function ($scope, $window, PageBroker, api, gettextCatalog) {
    function getAliases(list) {
      return api.citizen_aliases
        .query({
          where: JSON.stringify({
            tags: list._id
          })
        })
        .then(function(response) {
          var aliases = response._items;
          $scope.deletable = aliases.length === 0;
          return aliases;
        });
    }
    function alarm() {
      var text = 'This citizen list is not empty and thus it cannot be deleted',
          translated = gettextCatalog.getString(text);
      $window.alert(translated);
      $scope.back();
    }
    PageBroker
      .getData('/configure-lists/')
      .then(function(list){
        if (list === 'new') {
          $scope.newList = true;
          $scope.list = {
            variation: 'label-default'
          };
        } else {
          $scope.list = list;
          getAliases(list)
            .then(function(aliases){
              $scope.aliases = aliases;
            });
        }
      });
    $scope.back = function(){
      $window.history.back();
    };
    $scope.save = function(){
      $scope.disabled = true;
      api.citizen_lists
        .save($scope.list)
        .then(function(){
          $scope.disabled = false;
          $scope.back();
        });
    };
    $scope.delete = function() {
      $scope.disabled = true;
      getAliases($scope.list)
        .then(function() {
          if ($scope.deletable) {
            api.citizen_lists
              .remove($scope.list)
              .then(function(){
                $scope.back();
              });
          } else {
            alarm();
          }
        });
    };
    $scope.variations = [
      'default',
      'primary',
      'success',
      'info',
      'warning',
      'danger'
    ].map(function(variation) {
      return {
        name: variation,
        class: 'label-' + variation
      };
    });
  });
