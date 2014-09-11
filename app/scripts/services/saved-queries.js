'use strict';

angular.module('citizendeskFrontendApp')
  .service('SavedQueries', function SavedQueries(reportStatuses) {
    var queries = {
      where: {}
    };
    queries.where.assigned = {
      $and: [{
        'assignments.user_id': { $exists: true }
      }, {
        $or: [{
          status: '',
        }, {
          status: {$exists: false}
        }, {
          'coverages.published': { $size: 0 }
        }]
      }]
    };
    queries.where.dismissed = { status: reportStatuses('dismissed') };
    queries.where.published = {
      'coverages.published': {
        // in order to specify a not empty array
        $elemMatch: {
          $exists: true
        }
      }
    };
    queries.where.debunked = { status: reportStatuses('debunked') };
    this.getWhere = function(key) {
      if (key in queries.where) {
        return queries.where[key];
      } else {
        throw Error('"'+key+'" is not a saved where query');
      }
    };
  });
