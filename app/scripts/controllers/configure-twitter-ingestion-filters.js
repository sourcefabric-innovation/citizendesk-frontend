'use strict';

angular.module('citizendeskFrontendApp')
  .controller('ConfigureTwitterIngestionFiltersCtrl', ['$scope', '$sails', 'SocketsHelpers', 'Raven', function ($scope, $sails, SocketsHelpers, Raven) {
    $scope.alert = '';
    $scope.disabled = false;
    $scope.canAddFilter = true;
    $sails
      .get('/twt_filters')
      .success(function(data) {
        $scope.twtFilters = data;
      });
    $scope.addFilter = function() {
      $scope.twtFilters.push({
        spec: {
          track: [],
          follow: [],
          locations: [],
          language: null
        }
      });
    };
    $scope.addTrack = function(filter) {
      filter.spec.track.push('');
    };
    $scope.saveFilter = function(filter) {
      var promise = SocketsHelpers.save(filter, '/twt_filters/');
      $scope.disabled = true;
      promise.success(function() {
        $scope.disabled = false;
        $scope.alert = '';
      });
      promise.error(function(response) {
        $scope.disabled = false;
        $scope.status = 'warning';
        $scope.alert = Raven.parseSocketError(response);
      });
    };
  }]);
