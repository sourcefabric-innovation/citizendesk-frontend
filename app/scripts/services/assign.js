'use strict';

angular.module('citizendeskFrontendApp')
  .service('Assign', function Assign(api, $q, allPages) {
    var service = this;
    this.users = [];
    this.totals = {};
    /* update the total counts of reports assigned to every user */
    this.updateTotals = function() {
      usersDeferred.then(function() {
        service.users.forEach(function(user) {
          api.reports
            .query({
              where: JSON.stringify({
                $and: [{
                  'assignments.user_id': user._id
                }, {
                  $or: [{
                    status: '',
                  }, {
                    status: {$exists: false}
                  }, {
                    'coverages.published': { $size: 0 }
                  }]
                }]
              })
            })
            .then(function(response) {
              service.totals[user._id] = response._meta.total;
            });
        });
      });
    };
    /* the users list is fetched just once when the service is created */
    var usersDeferred = allPages(function(page) {
      return api.users
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
          return response;
        })
    });
  });
