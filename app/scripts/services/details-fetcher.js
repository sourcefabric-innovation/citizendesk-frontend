'use strict';

/*
 in some cases we just get the id referencing a resource, and we
 have to issue extra calls in order to fetch the details. the result
 is like embedding in Eve, but sometimes it is not possible to
 embed.

 for example currently (July 2014) it is not possible to specify as
 embeddable a property that can be also `null`. Eve will raise an error
 in that case
 */

angular.module('citizendeskFrontendApp')
  .factory('detailsFetcher', function () {
    return function(id, endpoint, resultDictionary) {
      /* we set the details value to `false` in order to avoid
      multiple calls for the same id. at the same time, a value that
      evaluates to false can be used by the template in order to not
      show the details section */
      if (resultDictionary[id] === false) {
        return;
      } else {
        resultDictionary[id] = false;
        endpoint
          .getById(id)
          .then(function(document) {
            resultDictionary[id] = document;
          });
      }
    };
  });
