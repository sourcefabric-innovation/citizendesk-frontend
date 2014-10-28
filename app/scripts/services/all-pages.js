'use strict';
// this service abstracts a common operation done when querying
// records on multiple pages. for every page we have to look in the
// metadata, in case there is another page to fetch. the code here is a
// bit complex, do not be scared. a chain of promises is created, so
// that the promise returned by `allPages` is resolved just when all
// the pages are fetched. if you want to understand the code better,
// write some extra test! remember that in Angular promises get
// resolved just after calling `$digest` on a scope
angular.module('citizendeskFrontendApp')
  .factory('allPages', function ($q) {
    function fetchMultiple(fetchOne, page) {
      // attention! explosive promise chaining here! :)
      return fetchOne(page)
        .then(function(response) {
          if (response._links.next) {
            // chain this promise with the next one
            return fetchMultiple(fetchOne, page + 1);
          } else {
            // resolve all the chain
            return $q.when(response);
          }
        });
    }
    function allPages(fetchOne) {
      return fetchMultiple(fetchOne, 1);
    }
    return allPages;
  });
