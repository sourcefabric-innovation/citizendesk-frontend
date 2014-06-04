'use strict';
/* jshint camelcase: false */

angular.module('citizendeskFrontendApp')
  .service('TwitterSearches', ['$resource', '$q', 'Raven', 'prefix', '$http', 'reportResource', function TwitterSearches($resource, $q, Raven, prefix, $http, reportResource) {
    var service = this;
    var Search = $resource(prefix + '/twt-searches');
    this.promise = Search.query().$promise;
    this.list = [];
    // dictionary to keep track of twitter searches whose reports have
    // already been fetched
    this.fetched = {};
    this.promise.then(function(searches) {
      service.list = searches;
    });
    /*
     create the search, get the id from the database, use it in order
     to trigger an actual search action
     */
    this.create = function(terms) {
      var query = {
        contains: [terms]
      };
      var newSearch = new Search({
        description: terms,
        query: query
      });
      var deferred = $q.defer();
      newSearch
        .$save()
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
        reportResource
          .query({ where: query })
          .$promise
          .then(function(reports) {
            queue.reports = reports;
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
  }]);
