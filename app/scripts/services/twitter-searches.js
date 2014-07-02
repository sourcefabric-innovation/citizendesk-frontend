'use strict';
/* jshint camelcase: false */

angular.module('citizendeskFrontendApp')
  .service('TwitterSearches', function($resource, $q, Raven, prefix, $http, api, lodash) {

    var service = this,
        res = api.twtSearches,
        _ = lodash;

    this.promise = res.query();
    this.list = [];
    // dictionary to keep track of twitter searches whose reports have
    // already been fetched
    this.fetched = {};
    this.promise.then(function(response) {
      service.list = response._items;
    });
    /*
     create the search, get the id from the database, use it in order
     to trigger an actual search action
     */
    this.create = function(terms) {
      var query = {
        contains: [terms]
      };
      var deferred = $q.defer();
      res
        .create({
          description: terms,
          query: query
        })
        .then(function(queue) {
          $http
            .post(prefix + '/proxy/start-twitter-search/', {
              user_id: '1',
              request_id: queue._id,
              search_spec: {
                query: query
              }
            })
            .then(function() {
              deferred.resolve(queue._id);
              service.list.push(queue);
              service.fetchResults(queue);
            });
        });
      return deferred.promise;
    };
    this.fetchResults = function(queue) {
      var id = queue._id;
      if (id in service.fetched) {
      } else {
        var query = JSON.stringify({
          'channels.request': id
        });
        api.reports
          .query({ where: query })
          .then(function(response) {
            queue.reports = response._items;
            service.fetched[id] = true;
          });
        }
    };
    this.byId = function(id) {
      for (var i=0; i<service.list.length; i++) {
        if (typeof id === 'undefined' || service.list[i]._id === id) {
          return service.list[i];
        }
      }
      Raven.raven.captureMessage('twitter search with id ' + id + ' not found');
    };
    this.delete = function(queue) {
      var promise = res.remove(queue);
      promise.then(function() {
        _.remove(service.list, queue);
      });
      return promise;
    };
  });
