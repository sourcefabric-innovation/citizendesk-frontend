'use strict';

angular.module('citizendeskFrontendApp')
  .factory('etagInterceptor', ['Raven', '$q', function (Raven, $q) {
    return {
      request: function(config) {
        if (config.method === 'PUT' || config.method === 'PATCH') {
          var etag = config.data._etag;
          if (etag) {
            if (!('headers' in config)) {
              config.headers = {};
            }
            config.headers['If-Match'] = etag;
            // now let's delete all those fields that Eve adds
            // automatically, but that it does not want to see on
            // these kind of requests
            delete config.data._created;
            delete config.data._etag;
            delete config.data._id;
            delete config.data._links;
            delete config.data._updated;
            delete config.data._status;

            return config;
          } else {
            var message = 'no etag in an object sent for update';
            Raven.raven.captureMessage(message, {extra: config.data});
            // rejecting the request. Eve will reply with a 403
            // anyway, which has not the cross origin headers and may
            // be harder to debug
            return $q.reject(message);
          }
        }
        return config;
      }
    };
  }]);
