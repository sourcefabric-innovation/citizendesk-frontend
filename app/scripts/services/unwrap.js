'use strict';

angular.module('citizendeskFrontendApp')
  .constant('unwrap', function(response) {
    if(angular.isArray(response._items)) {
      response._items._links = response._links;
      return response._items;
    } else {
      return response;
    }
  });
