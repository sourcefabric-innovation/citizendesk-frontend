'use strict';

angular.module('citizendeskFrontendApp')
  .factory('cacheBuster', function (now, $templateCache) {
    return {
      request: function(config) {
        // templateCache safe cache busting (doesnt stomp on
        // angularui's bootstrap)
        if ($templateCache.get(config.url)){
          return config;
        } else {
          var prefix;
          if (config.url.search('\\?') !== -1){
            prefix = '&';
          } else {
            prefix = '?';
          }
          config.url += prefix + 'cachebuster=' + now();
          return config;
        }
      }
    };
  });
