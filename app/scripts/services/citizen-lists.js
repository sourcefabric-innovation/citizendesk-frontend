'use strict';

angular.module('citizendeskFrontendApp')
  .service('CitizenLists', function CitizenLists(api) {
    this.update = function(){
      return api.citizen_lists.query();
    };
    this.promise = this.update();
  });
