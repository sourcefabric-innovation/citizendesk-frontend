'use strict';

angular.module('citizendeskFrontendApp')
  .controller('ConfigureCoveragesCtrl', function ($scope, api, lodash, $modal) {
    function modifying(promise) {
      $scope.disabled = true;
      return promise.then(function() {
        $scope.disabled = false;
      });
    }
    api.coverages
      .query()
      .then(function(response) {
        $scope.coverages = response._items;
      });
    $scope.save = function(coverage) {
      modifying(api.coverages
        .save(coverage)
        .then(function(){
          $scope.disabled = false;
        }));
    };
    $scope.remove = function(coverage) {
      var modal = $modal.open({
        templateUrl: 'views/modals/remove-coverage.html'
      });
      modal.result
        .then(function(){
          modifying(api.coverages
                    .remove(coverage)
                    .then(function(){
                      lodash.remove($scope.coverages, function(candidate) {
                        return candidate._id === coverage._id;
                      });
                    }));
        });
    };
    $scope.add = function(){
      $scope.coverages.push({});
    };
  });
