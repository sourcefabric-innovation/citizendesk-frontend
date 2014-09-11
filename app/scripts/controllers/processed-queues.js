'use strict';

angular.module('citizendeskFrontendApp')
  .controller('ProcessedQueuesCtrl', function ($scope, ProcessedQueues, gettextCatalog) {
    $scope.collapseEmpty = true;
    $scope.groups = [{
      key: 'published_debunked',
      description: gettextCatalog.getString('Published but debunked!'),
      class: 'list-group-item-danger'
    }, {
      key: 'published_dismissed',
      description: gettextCatalog.getString('Published but dismissed!'),
      class: 'list-group-item-danger'
    }, {
      key: 'not_published_verified',
      description: gettextCatalog.getString('Verified but not published yet'),
      class: 'list-group-item-warning'
    }, {
      key: 'published_assigned',
      description: gettextCatalog.getString('Published and still assigned'),
      class: 'list-group-item-warning'
    }, {
      key: 'published_verified',
      description: gettextCatalog.getString('Published and verified'),
    }, {
      key: 'not_published_dismissed',
      description: gettextCatalog.getString('Dismissed, not published'),
    }, {
      key: 'not_published_debunked',
      description: gettextCatalog.getString('Debunked, not published'),
    }, {
      key: 'not_published_assigned',
      description: gettextCatalog.getString('Assigned, not published'),
    }];
    $scope.totals = {};
    $scope.groups.forEach(function (group) {
      ProcessedQueues
        .getResponses(group.key)
        .onValue(function(response) {
          $scope.totals[group.key] = response._meta.total;
        });
    });
    $scope.update = function() {
      $scope.groups.forEach(function(group) {
        ProcessedQueues.requests.push(group.key);
      });
    };
    $scope.update();
  });
