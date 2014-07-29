'use strict';

angular.module('citizendeskFrontendApp')
  .factory('dateFetcherFactory', function (superdeskDate, lodash) {
    var _ = lodash;
    return function(arg) {
      var fetcher = {
        /*

         fetcher.date could remain null if the fetcher will just
         receive empty arrays

         */
        date: null,
        update: function(arr) {
          var dates = [];
          arr.forEach(function(element) {
            var s = element[arg.property];
            if(s) {
              var d = superdeskDate.parse(s);
              dates.push(d);
            }
          });
          if (dates.length) {
            var max = _.max(dates);
            this.date = superdeskDate.render(max);
          }
        },
        queryWhere: function(originalWhere) {
          var fetcher = this,
              ourCondition = {};
          if (fetcher.date) {
            ourCondition = {
            };
            ourCondition[arg.property] = {
                $gt: fetcher.date
            };
          }
          var params = {
            where: JSON.stringify({
              $and: [
                originalWhere,
                ourCondition
              ]
            })
          };
          return arg.endpoint.query(params)
            .then(function(response) {
              fetcher.update(response._items);
              return response;
            });
        }
      };
      fetcher.update(arg.initialise);
      return fetcher;
    };
  });
