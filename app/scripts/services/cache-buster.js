'use strict';

angular.module('citizendeskFrontendApp')
  .provider('cacheBuster', function() {
    var provider = this;
    this.disabled = false;
    this.$get = ['now', '$templateCache', function (now, $templateCache) {
      return {
        request: function(config) {
          if (provider.disabled) {
            return config;
          } else {
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
        }
      };
    }];
  });
