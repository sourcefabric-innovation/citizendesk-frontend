'use strict';

angular.module('citizendeskFrontendApp')
  .factory('resource', ['$resource', function ($resource) {
    return function(url, paramDefaults, actions, options) {

      actions = angular.extend(actions || {}, {
        create: { method: 'POST' },
        update: { method: 'PUT' }
      });

      var resource = $resource(url, paramDefaults, actions, options);

      /* http://kirkbushell.me/angular-js-using-ng-resource-in-a-more-restful-manner/ */
      resource.prototype.$save = function() {
        if ( !this._id ) {
          return this.$create();
        } else {
          return this.$update({ id: this._id });
        }
      };
      
      return resource;
    };
  }]);
