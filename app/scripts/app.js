'use strict';

angular
  .module('citizenfrontApp', [
    'ngRoute',
    'ngResource',
    'ngSails'
  ])
  .config(['$routeProvider', '$sailsProvider', function($routeProvider, $sailsProvider) {
    $routeProvider
    /*
      .when('/', {
      templateUrl: 'views/main.html',
      controller: 'MainCtrl'
      })
    */
      .when('/new-report', {
        templateUrl: 'views/new-report.html',
        controller: 'NewReportCtrl'
      })
      .when('/list-reports', {
        templateUrl: 'views/list-reports.html',
        controller: 'ReportListCtrl'
      })
      .when('/configure', {
        templateUrl: 'views/configure.html',
        controller: 'ConfigureCtrl'
      })
      .when('/configure-autoreply', {
        templateUrl: 'views/configure-autoreply.html',
        controller: 'ConfigureAutoreplyCtrl'
      })
      .when('/configure-twitter-ingestion', {
        templateUrl: 'views/configure-twitter-ingestion.html',
        controller: 'ConfigureTwitterIngestionCtrl'
      })
      .when('/configure-twitter-ingestion-filters', {
        templateUrl: 'views/configure-twitter-ingestion-filters.html',
        controller: 'ConfigureTwitterIngestionFiltersCtrl'
      })
      .when('/configure-twitter-ingestion-oauths', {
        templateUrl: 'views/configure-twitter-ingestion-oauths.html',
        controller: 'ConfigureTwitterIngestionOauthsCtrl'
      })
      .when('/configure-twitter-ingestion-streams', {
        templateUrl: 'views/configure-twitter-ingestion-streams.html',
        controller: 'ConfigureTwitterIngestionStreamsCtrl'
      })
      .otherwise({
        redirectTo: '/list-reports'
      });
    $sailsProvider.url = 'http://martin.sourcefabric.net:1337';
  }]);
