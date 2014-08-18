'use strict';
/* jshint camelcase: false */

angular.module('citizendeskFrontendApp')
  .controller('SessionCtrl', function ($scope, api, $routeParams, $http, config, session, addNewValues, PagePolling, Body, $filter, $location, superdeskDate) {
    Body.glue = true;
    $scope.body = Body;
    $scope.reports = [];
    $scope.summaries = [];
    $scope.replies = {};
    $scope.users = {};
    $scope.$watch('reports', function() {
      // scan the list of reports from the last (most recent) to the first
      for(var i=($scope.reports.length-1); i >= 0; i--) {
        // choose the first report with an author
        if (!($scope.reports[i].local)) {
          $scope.replyReport = $scope.reports[i];
          return;
        }
      }
      // we do not expect to have a session without any report
      // generated by a citizen
      if ($scope.reports.length) {
        throw new Error('no valid report found for replies in session '+$routeParams.session);
      }
    }, true);
    $scope.reset = function() {
      $scope.reply = '';
    };
    $scope.sendReply = function(data) {
      data.user_id = session.identity._id;
      data.sensitive = false;
      data.language = 'en';
      $http
        .post(config.server.url + 'proxy/mobile-reply/', data)
        .then(function() {
          $scope.reset();
          fetchReports();
        });
    };

    function fetchAll(originalQuery, handler, page) {
      var query = angular.copy(originalQuery);
      query.page = page || 1;
      api.reports
        .query(query)
        .then(function(response) {
          handler(response);
          if (response._links.next) {
            fetchAll(page + 1, query, handler);
          }
        });
    }
    function fetchSummaries() {
      var query = {
        where: JSON.stringify({
          $and: [{
            session: $routeParams.session
          }, {
            summary: true
          }]
        }),
        sort:'[("produced", 1)]'
      };
      fetchAll(query, function(response) {
        addNewValues($scope.summaries, response._items);
      });
    }
    function fetchReports() {
      var query = {
        where: JSON.stringify({
          $and: [{
            session: $routeParams.session
          }, {
            summary: false
          }]
        }),
        sort:'[("produced", 1)]'
      };
      fetchAll(query, function(response) {
        addNewValues($scope.reports, response._items);
      });
    }
    fetchReports();
    fetchSummaries();
    PagePolling.setInterval(function() { fetchReports(); }, 10 * 1000);

    function fetchUsers(page) {
      api.users
        .query({ page: page })
        .then(function(response) {
          response._items.map(function(user) {
            $scope.users[user._id] = user;
          });
          if (response._links.next) {
            fetchUsers(page + 1);
          }
        });
    }
    fetchUsers(1);

    $scope.submitSummary = function() {
      api.reports
        .save({
          texts: [{
            original: $scope.summaryContent
          }],
          summary: true,
          session: $routeParams.session,
          channels: [{
            type: 'frontend'
          }],
          produced: superdeskDate.render(new Date()),
          created: superdeskDate.render(new Date()),
          authors: [{
            authority: 'citizen_desk',
            identifiers: session._id
          }]
        })
        .then(function() {
          fetchSummaries();
        });
    };
    $scope.goToSummary = function(){
      $location.url('/report-sms/'+$scope.summaries[0]._id);
    };
  });
