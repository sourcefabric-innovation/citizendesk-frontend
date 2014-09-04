'use strict';

angular.module('citizendeskFrontendApp')
  .service('Body', function Body($rootScope) {
    var service = this;
    // for the scroll glue directive attached to the body
    this.glue = false;
    $rootScope.$on('$routeChangeStart', function() {
      // new pages are not glued to the bottom by default
      service.glue = false;
    });
    this.connectionError = null;
  });
