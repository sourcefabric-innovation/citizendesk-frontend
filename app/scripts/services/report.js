'use strict';
/* jshint camelcase: false */

angular.module('citizendeskFrontendApp')
  .service('Report', function Report(api, session, $q, config, $http, gettextCatalog, $window, linkTweetEntities, Raven, reportStatuses, superdeskDate) {
    this.linkTweetTexts = function(report) {
      if (report.feed_type === 'tweet') {
        try {
          report.linkedText = linkTweetEntities(report);
        } catch (exception) {
          Raven.raven.captureException(exception);
        }
      }
    };
    this.linkTweetTextsInList = function(list) {
      list.forEach(this.linkTweetTexts);
    };
    this.getDismiss = function(disabled, callback) {
      return function(report) {
        disabled[report._id] = true;
        return api.reports
          .update(report, {
            assignments: [],
            status: reportStatuses('dismissed'),
            status_updated: superdeskDate.render(new Date())
          })
          .then(function(response) {
            disabled[report._id] = false;
            callback(response);
          });
      };
    };
    // see
    // https://github.com/sourcefabric-innovation/citizendesk-frontend/issues/29
    // for a bit more details about the initial properties
    this.create = function(parameters) {
      return {
        texts: [],
        summary: false,
        session: parameters.session,
        channels: [{
          type: 'frontend'
        }],
        produced: superdeskDate.render(new Date()),
        user_id: session._id,
        authors: [{
          authority: 'citizen_desk',
          identifiers: {
            user_name:         session.identity._id,
            user_name_search:  session.identity._id,
            user_display_name: session.identity.username
          }
        }],
        assignments: [],
        feed_type: 'plain',
        automatic: false,
        local: true,
        proto: false,
        notices_outer: []
      };
    };
  });
