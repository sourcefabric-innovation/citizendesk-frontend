'use strict';

angular.module('citizendeskFrontendApp')
  .service('SavedQueries', function SavedQueries(reportStatuses) {
    function published() {
      return {
        'coverages.published': {
          // in order to specify a not empty array
          $elemMatch: {
            $exists: true
          }
        }
      };
    }
    function assigned() {
      return {
        $and: [{
          'assignments.user_id': { $exists: true }
        }, {
          $or: [{
            status: '',
          }, {
            status: {$exists: false}
          }]
        }]
      };
    }
    function not_published() {
      return {
        $or: [{
          'coverages.published': {
            $size: 0
          }
        }, {
          'coverages.published': {
            $exists: false
          }
        }]
      };
    }
    var queries = {
      where: {}
    };
    queries.where.assigned = assigned();
    queries.where.not_published_assigned = {
      $and: [assigned(), not_published()]
    };
    queries.where.published_assigned = {
      $and: [assigned(), published()]
    };
    queries.where.dismissed = { status: reportStatuses('dismissed') };
    queries.where.debunked = { status: reportStatuses('debunked') };
    queries.where.published = published();
    queries.where.published_debunked = {
      $and: [published(), {
        status: reportStatuses('debunked')
      }]
    };
    queries.where.not_published_debunked = {
      $and: [not_published(), {
        status: reportStatuses('debunked')
      }]
    };
    queries.where.not_published_verified = {
      $and: [not_published(), {
        status: reportStatuses('verified')
      }]
    };
    queries.where.published_verified = {
      $and: [published(), {
        status: reportStatuses('verified')
      }]
    };
    queries.where.published_dismissed = {
      $and: [published(), {
        status: reportStatuses('dismissed')
      }]
    };
    queries.where.not_published_dismissed = {
      $and: [not_published(), {
        status: reportStatuses('dismissed')
      }]
    };
    this.getWhere = function(key) {
      if (key in queries.where) {
        return queries.where[key];
      } else {
        throw Error('"'+key+'" is not a saved where query');
      }
    };
  });
