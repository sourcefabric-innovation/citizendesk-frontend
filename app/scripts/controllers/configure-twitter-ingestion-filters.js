'use strict';

angular.module('citizendeskFrontendApp')
  .controller('ConfigureTwitterIngestionFiltersCtrl', ['$scope', 'prefix', '$resource', 'Raven', function ($scope, prefix, $resource, Raven) {
    var Resource = $resource(prefix + '/twt_filters');
    $scope.alert = '';
    $scope.disabled = false;
    $scope.canAddFilter = true;
    $scope.twtFilters = Resource.query();
    $scope.addFilter = function() {
      $scope.twtFilters.push(new Resource({
        spec: {
          track: [],
          follow: [],
          locations: [],
          language: null
        }
      }));
    };
    $scope.addTrack = function(filter) {
      filter.spec.track.push('');
    };
    $scope.saveFilter = function(filter) {
      $scope.disabled = true;
      filter.$save().$promise.then(
        function() {
          $scope.disabled = false;
          $scope.alert = '';
        },
        function(response) {
          $scope.disabled = false;
          $scope.status = 'warning';
          $scope.alert = Raven.parseSocketError(response);
        });
    };
  }]);
