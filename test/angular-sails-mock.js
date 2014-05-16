/*

 mock for the angular sails module. trying to test a module depending
 on $sails will raise an infinite stack call in the unit tests, this
 is why in the karma configuration file this mock is substituting the
 actual module.

 inspired by the original angular-sails code

 the goal of this module for now is to avoid annoying stack explosions
 while testing, but in the future it may become an useful tool to mock
 responses, replacing the rudimental mock in `globals`

 */
angular
  .module('ngSails', ['ng'])
  .provider('$sails', function() {
    var provider = this,
        httpVerbs = ['get', 'post', 'put', 'delete'],
        eventNames = ['on', 'once'];

    this.url = undefined;

    this.$get = ['$q', function($q) {
      var socket = {},
          defer = function () {
            var deferred = $q.defer(),
                promise = deferred.promise;

            promise.success = function (fn) {
              promise.then(fn);
              return promise;
            };

            promise.error = function (fn) {
              promise.then(null, fn);
              return promise;
            };

            return deferred;
          },
          promisify = function (methodName) {
            socket['legacy_' + methodName] = socket[methodName];
            socket[methodName] = function (url, data, cb) {
              var deferred = defer();
              if (cb === undefined && angular.isFunction(data)) {
                cb = data;
                data = null;
              }
              deferred.promise.then(cb);
              /* disabled for the mock
               socket['legacy_' + methodName](url, data, function (result) {
               resolveOrReject(deferred, result);
               });
               */
              return deferred.promise;
            };
          };
      angular.forEach(httpVerbs, promisify);

      return socket;
    }];
  });
