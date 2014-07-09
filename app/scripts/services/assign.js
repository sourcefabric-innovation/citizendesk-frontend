'use strict';

angular.module('citizendeskFrontendApp')
  .service('Assign', function Assign(api) {
    var service = this;
    this.users = [];
    this.update = function(page) {
      api.users
        .query({
          page: page
        })
        .then(function(response) {
          // the collection is small at the moment. remember that we
          // cannot overwrite the reference otherwise controllers will
          // not be able to update
          response._items.forEach(function(user) {
            service.users.push(user);
          });
          if (response._links.next) {
            service.update(page + 1);
          }
        });
    };
    this.update(1);
  });
