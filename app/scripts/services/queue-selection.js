'use strict';

/*

 this service is currently used just as shared data structure in order
 to show a description for the currently displayed queue in the queue
 selection section

 eventually i added the description reset on route change, which
 prevents showing the old description on a different page. see
 https://github.com/sourcefabric-innovation/citizendesk-frontend/issues/65

 */

angular.module('citizendeskFrontendApp')
  .service('QueueSelection', function ($rootScope) {
    var service = this;
    $rootScope.$on('$locationChangeSuccess', function() {
      delete service.description;
    });
  });
