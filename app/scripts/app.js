'use strict';

angular
  .module('citizendeskFrontendApp', [
    'ngRoute',
    'ngResource',
    'ngMessages',
    'gettext',
    'eveApi',
    'mgcrea.ngStrap.helpers.dimensions',
    'mgcrea.ngStrap.helpers.debounce',
    'mgcrea.ngStrap.scrollspy',
    'mgcrea.ngStrap.modal',
  ])
  .constant('config', {
    server: { url: 'http://cd2.sourcefabric.net/citizendesk-interface/' }
  })
  .config(['$routeProvider', 'prefix', '$httpProvider', 'unwrap', 'apiProvider', function($routeProvider, prefix, $httpProvider, unwrap, apiProvider) {
    apiProvider.api('steps', { type:'http', backend: { rel:'steps' }});
    apiProvider.api('reports', { type:'http', backend: { rel:'reports' }});
    apiProvider.api('twtSearches', { type:'http', backend: { rel:'twt-searces' }});
    apiProvider.api('users', { type:'http', backend: { rel:'users' }});
    $httpProvider.defaults.transformResponse.push(unwrap);
    $httpProvider.interceptors.push('errorHttpInterceptor');
    $httpProvider.interceptors.push('etagInterceptor');
    $httpProvider.interceptors.push('AuthInterceptor');
    $routeProvider
      .when('/new-report', {
        templateUrl: 'views/new-report.html',
        controller: 'NewReportCtrl'
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
      .when('/mobile-queue/', {
        templateUrl: 'views/mobile-queue.html',
        controller: 'MobileQueueCtrl'
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
      .when('/web-queue', {
        templateUrl: 'views/web-queue.html',
        controller: 'WebQueueCtrl'
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
  }]).run(function(gettextCatalog, Raven, initAuth){
    //gettextCatalog.currentLanguage = 'it_IT';
    gettextCatalog.debug = true;
    Raven.install();
    initAuth();
  });
