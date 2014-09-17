'use strict';

angular.module('citizendeskFrontendApp')
  .service('AliasesInLists', function (api, Raven) {
    var service = this,
        /* we could generally build an index for all the aliases, but
        we cannot be sure that they will be in a small number. on the
        other hand, aliases included in lists are manually managed, so
        they will be fewer */
        query = {
          where: JSON.stringify({
            tags: {
              $elemMatch: {
                $exists: true
              }
            }
          }),
          embedded: '{"tags":1}'
        };

    this.update = function(){
      service.indexPromise = 
        api.citizen_aliases
        .query(query)
        .then(function(response) {
          var index = service.createIndex(response);
          return index; // resolves the promise with the index
        });
    };
    this.createIndex = function(response){
      var index = {};
      response._items.forEach(function(item){
        var authority = item.authority,
            id = item.identifiers.user_name,
            updated = index[authority] || {};
        updated[id] = item;
        index[authority] = updated;
      });
      return index;
    };
    this.embedAuthorAlias = function(report){
      try {
        report.authors.forEach(function (author) {
          if (author.identifiers) {
            var authority = author.authority,
                id = author.identifiers.user_name;
            service.indexPromise.then(function(index){
              if (index[authority] && index[authority][id]) {
                author.alias = index[authority][id];
              }
            });
          }
        });
      } catch (e) {
        Raven.raven.captureException(e, {
          extra: {
            report_id: report._id
          }
        });
      }
    };

    this.update();
  });
