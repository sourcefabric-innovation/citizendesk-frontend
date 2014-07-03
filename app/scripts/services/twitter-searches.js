'use strict';
/* jshint camelcase: false */

angular.module('citizendeskFrontendApp')
  .service('TwitterSearches', function($resource, $q, Raven, prefix, $http, api, lodash, addNewValues) {

    var service = this,
        res = api.twtSearches,
        _ = lodash;

    this.promise = res.query();
    this.list = [];
    this.promise.then(function(response) {
      service.list = response._items;
    });
    this.start = function(queue) {
      if ('reports' in queue) {
        return $q.when();
      } else {
        queue.reports = [];
        return $http
          .post(prefix + '/proxy/start-twitter-search/', {
            user_id: '1',
            request_id: queue._id,
            search_spec: {
              query: queue.query
            }
          })
          .then(function() {
            service.fetchResults(queue);
          });
      }
    };
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
          service.list.push(queue);
          deferred.resolve(queue._id);
        });
      return deferred.promise;
    };
    this.fetchResults = function(queue) {
      var query = JSON.stringify({
            'channels.request': queue._id
          });
      function fetch(page) {
        api.reports
          .query({
            where: query,
            sort:'[("produced", -1)]',
            page: page
          })
          .then(function(response) {
            addNewValues(queue.reports, response._items);
            if (response._links.next) {
              fetch(page + 1);
            }
          });
      }
      fetch(1);
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
