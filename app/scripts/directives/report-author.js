'use strict';

angular.module('citizendeskFrontendApp')
  .directive('reportAuthor', function () {
    return {
      restrict: 'E',
      templateUrl: 'views/directives/report-author.html',
      scope: {
        author: '='
      }
    };
  });
