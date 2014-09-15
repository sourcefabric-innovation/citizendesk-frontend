'use strict';
/* jshint unused: false */

angular.module('citizendeskFrontendApp')
  .directive('scrollTarget', function (ScrollTo, $document) {
    return {
      restrict: 'A',
      scope: {
        scrollTarget: '='
      },
      link: function postLink(scope, element, attrs) {
        ScrollTo.target.onValue(function(target) {
          if (target === scope.scrollTarget) {
            $document.scrollTo(element, 200, 900);
          }
        });
      }
    };
  });
