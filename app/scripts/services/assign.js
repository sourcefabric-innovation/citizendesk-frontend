'use strict';

angular.module('citizendeskFrontendApp')
  .service('Assign', function Assign(api, $q) {
    var service = this,
        usersDeferred = $q.defer();
    this.users = [];
    this.totals = {};
    this.updateUsers = function(page) {
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
            service.updateUsers(page + 1);
          } else {
            usersDeferred.resolve();
          }
        });
    };
    /* update the total counts of reports assigned to every user */
    this.updateTotals = function() {
      usersDeferred.promise.then(function() {
        service.users.forEach(function(user) {
          api.reports
            .query({
              where: JSON.stringify({
                'assignments.user_id': user._id
              })
            })
            .then(function(response) {
              if('_meta' in response) {
                service.totals[user._id] = response._meta.total;
              }
            });
        });
      });
    };
    /* the users list is fetched just once when the service is created */
    this.updateUsers(1);
  });
