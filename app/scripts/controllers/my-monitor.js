'use strict';
/* jshint camelcase: false */

/*

 Pagination behavior:

 This page is going to receive many updates in real time. It will show
 a counter for new messages on the top and a button for loading new
 pages at the bottom. Loading extra pages may produce a result which
 looks inconsistent for the user, because if many new reports arrived
 the next pages will be full of reports that were on the previous
 pages, when they are ordered by recency

 */

angular.module('citizendeskFrontendApp')
  .controller('MyMonitorCtrl', function ($scope, api, $http, Monitors, session, Raven, config, addNewValues, dateFetcherFactory, PagePolling, QueueSelection, $filter, linkTweetEntities, PageBroker, AliasesInLists, $timeout) {
    $scope.missing = {
      monitor: false,
      key: false
    };
    $scope.disabled = false;
    $scope.editing = false;
    $scope.newReports = []; // filled by the polling loop
    $scope.search = [];
    $scope.$watch('missing', function() {
      var miss = $scope.missing;
      /* if we are lacking key and monitor, point the user to key creation */
      $scope.showKeyPointer = miss.monitor && miss.key;
      /* if we are lacking the monitor but we have the key, offer the
      user to initialise a monitor */
      $scope.showCreate = miss.monitor && (!miss.key);
      /* if we have no key but we have a monitor, the page can work
      normally, but this is strange, it should not happend */
      if(miss.key && (!miss.monitor)) {
        Raven.raven.captureMessage(
          'This user has no keys but she has a running monitor!',
          {extra: { name: session.identity.username}}
        );
      }
    }, true); // object equality
    $scope.$watch('monitor', function() {
      if ($scope.monitor) {
        var track = $scope.monitor.filter.spec.track;
        $scope.search = track;
        QueueSelection.description = track.join(', ');
      }
    }, true); // object equality

    var monitor = {
      start: function(m) {
        return $http.get(config.server.url+'/proxy/start-stream/'+m._id);
      },
      stop: function(m) {
        return $http.get(config.server.url+'/proxy/stop-stream/'+m._id);
      }
    };
    var timeoutPromise;

    function processReport(report) {
      try {
        report.linkedText = linkTweetEntities(report);
      } catch (e) {
        Raven.raven.captureException(e);
      }
      AliasesInLists.embedAuthorAlias(report);
    }
    function fetchReports(page) {
      return api.reports.query({
        page: page,
        sort:'[("produced", -1)]',
        where: JSON.stringify({
          'channels.value': $scope.monitor._id
        })
      });
    }
    function initReports() {
      $scope.page = 1;
      fetchReports($scope.page).then(function(response) {
        $scope.reports = response._items;
        $scope.reports.forEach(processReport);

        var dateFetcher = dateFetcherFactory({
          endpoint: api.reports,
          property: 'produced',
          initialise: $scope.reports
        });
        PagePolling.setInterval(function() {
          $scope.updating = true;
          dateFetcher
            .queryWhere({'channels.value': $scope.monitor._id})
            .then(function(response) {
              $scope.updating = false;
              response._items.forEach(processReport);
              addNewValues($scope.newReports, response._items);
            });
        }, 10 * 1000);
      });
    }
    function explainUser() {
      $timeout.cancel(timeoutPromise);
      $scope.tellToWait = true;
      timeoutPromise = $timeout(function() {
        $scope.tellToWait = false;
      }, 10 * 1000);
    }
    $scope.moreReports = function() {
      $scope.page += 1;
      fetchReports($scope.page).then(function(response) {
        addNewValues($scope.reports, response._items);
      });
    };

    $scope.showNew = function() {
      addNewValues($scope.reports, $scope.newReports);
      $scope.reports = $filter('sortByDate')($scope.reports, 'produced', true);
      $scope.newReports = [];
    };

    Monitors
      .getByUserId(session.identity._id)
      .then(function(monitor){
        if (monitor) {
          $scope.monitor = monitor;
          initReports();
        } else {
          $scope.missing.monitor = true;
        }
      });
    api.twt_oauths
      .query({
        where: JSON.stringify({
          user_id: session.identity._id
        })
      })
      .then(function(response) {
        var key = response._items.pop();
        if (key) {
          $scope.key = key;
        } else {
          $scope.missing.key = true;
        }
      });
    $scope.create = function() {
      var candidateFilter = {
        spec: {
          track: $scope.search
        }
      },
          createdFilter;
      $scope.disabled = true;
      api.twt_filters
        .save(candidateFilter)
        .then(function(_createdFilter_) {
          createdFilter = _createdFilter_;
          $scope.filter = createdFilter;
          var candidateMonitor = {
            user_id: session.identity._id,
            spec: {
              filter_id: createdFilter._id,
              oauth_id: $scope.key._id
            }
          };
          return api.twt_streams.save(candidateMonitor);
        })
        .then(function(createdMonitor) {
          $scope.monitor = createdMonitor;
          $scope.monitor.filter = createdFilter;
          delete $scope.missing.monitor;
          $scope.disabled = false;
          Monitors.update();
          return monitor.start(createdMonitor);
        })
        .then(function() {
          explainUser();
          initReports();
        });
    };
    $scope.edit = function() {
      $scope.editing = true;
    };
    $scope.cancelEdit = function() {
      $scope.editing = false;
    };
    $scope.save = function() {
      var candidate = angular.copy($scope.monitor.filter);
      candidate.spec.track = $scope.search;
      api.twt_filters
        .save(candidate)
        .then(function(response) {
          $scope.monitor.filter = response;
          return monitor.stop($scope.monitor);
        })
        .then(function() {
          return monitor.start($scope.monitor);
        })
        .then(function() {
          $scope.editing = false;
          explainUser();
          initReports();
        });
    };
    $scope.assign = function(report) {
      PageBroker.load('/assign/', {
        report: report
      });
    };
  });
