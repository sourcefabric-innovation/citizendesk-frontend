'use strict';

/*

 Queues can be monitors, twitter searches, and other stuff. I try to
 keep the queues status just in this service, but the logic for
 manipulating every different type of queue outside of it

 */
angular.module('citizendeskFrontendApp')
  .service('Queues', ['Monitors', '$q', function Queues(Monitors, $q) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var service = this,
        deferred = $q.defer();
    this.list = [];
    this.promise = deferred.promise;
    this.dependencies = {
      monitors: Monitors.getMonitors()
    };
    this.dependencies.monitors.then(function(monitors) {
      service.list = service.list.concat(monitors);
      deferred.resolve(service.list);
    });
  }]);
