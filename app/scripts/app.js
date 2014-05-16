'use strict';

angular
  .module('citizendeskFrontendApp', [
    'ngRoute',
    'ngResource',
    'ngSails',
    'gettext'
  ])
  .config(['$routeProvider', '$sailsProvider', 'prefix', function($routeProvider, $sailsProvider, prefix) {
    $sailsProvider.url = prefix;
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
      .when('/list-reports/:group', {
        templateUrl: 'views/list-reports.html',
        controller: 'ReportListCtrl'
      })
      .when('/verified-reports', {
        templateUrl: 'views/verified-reports.html',
        controller: 'VerifiedReportsCtrl'
      })
      .when('/reports/:id', {
        templateUrl: 'views/report.html',
        controller: 'ReportCtrl'
      })
      .when('/monitor/:id?', {
        templateUrl: 'views/monitor.html',
        controller: 'MonitorCtrl'
      })
      .when('/twitter-search/:id?', {
        templateUrl: 'views/twitter-search.html',
        controller: 'TwitterSearchCtrl'
      })
      .when('/configure', {
        templateUrl: 'views/configure.html',
        controller: 'ConfigureCtrl'
      })
      .when('/configure-autoreply', {
        templateUrl: 'views/configure-autoreply.html',
        controller: 'ConfigureAutoreplyCtrl'
      })
      .when('/configure-steps', {
        templateUrl: 'views/configure-steps.html',
        controller: 'ConfigureStepsCtrl'
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
      .when('/new-twitter-search', {
        templateUrl: 'views/new-twitter-search.html',
        controller: 'NewTwitterSearchCtrl'
      })
      // static pages, without controllers
      .when('/error-no-monitors', {
        templateUrl: 'views/error-no-monitors.html'
      })
      .when('/error-no-searches', {
        templateUrl: 'views/error-no-searches.html'
      })
      .otherwise({
        redirectTo: '/verified-reports'
      });
  }]).run(['gettextCatalog', 'Raven', function(gettextCatalog, Raven){
    //gettextCatalog.currentLanguage = 'it_IT';
    gettextCatalog.debug = true;
    Raven.install();
  }]);
