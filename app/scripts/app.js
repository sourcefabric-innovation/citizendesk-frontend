'use strict';
/* jshint camelcase: false */

angular
  .module('citizendeskFrontendApp', [
    'ngRoute',
    'ngResource',
    'ngMessages',
    'ngSanitize',
    'gettext',
    'eveApi',
    'ui.bootstrap',
    'luegg.directives',
    'matchMedia',
    'duScroll'
  ])
  .constant('config', {
    server: { url: 'https://cd2.sourcefabric.net/citizendesk-interface/' }
  })
  .config(['$routeProvider', '$httpProvider', 'apiProvider', function($routeProvider, $httpProvider, apiProvider) {
    [
      'steps',
      'reports',
      'users',
      'citizen_aliases',
      'coverages',
      'twt_oauths',
      'twt_streams',
      'twt_filters',
      'core_config',
      'citizen_lists',
      'report_statuses',
      'identity_records'
    ].forEach(function(entity) {
      apiProvider.api(entity, { type:'http', backend: { rel:entity }});
    });
    apiProvider.api('twt_searches', {
      type:'http', backend: { rel:'twt-searches' }
    });
    $httpProvider.interceptors.push('errorHttpInterceptor');
    $httpProvider.interceptors.push('AuthInterceptor');
    $httpProvider.interceptors.push('cacheBuster');
    $routeProvider
      .when('/new-report', {
        templateUrl: 'views/new-report.html',
        controller: 'NewReportCtrl'
      })
      // the following routes are automatically generated from the
      // reports, using the structure `/report-<feed_type>/id`, in
      // order to jump from the report summaries to the report details
      .when('/report-sms/:id', {
        templateUrl: 'views/report-sms.html',
        controller: 'ReportSmsCtrl'
      })
      // `feed_type` has value `plain`, for example, in the case of a
      // session summary. according to what Martin says, `plain`
      // should describe simple text reports. This can be rendered as
      // an `sms` is rendered at the moment
      .when('/report-plain/:id', {
        templateUrl: 'views/report-sms.html',
        controller: 'ReportSmsCtrl'
      })
      .when('/report-web_link/:id', {
        templateUrl: 'views/report-web-link.html',
        controller: 'ReportWebLinkCtrl'
      })
      .when('/report-tweet/:id', {
        templateUrl: 'views/report-tweet.html',
        controller: 'ReportTweetCtrl'
      })
      .when('/monitor/:id?', {
        templateUrl: 'views/monitor.html',
        controller: 'MonitorCtrl'
      })
      .when('/twitter-search/:id?', {
        templateUrl: 'views/twitter-search.html',
        controller: 'TwitterSearchCtrl'
      })
      .when('/citizen-card/:authority/:id', {
        templateUrl: 'views/citizen-card.html',
        controller: 'CitizenCardCtrl'
      })
      .when('/generic-report-list/:query', {
        templateUrl: 'views/simple-report-list.html',
        controller: 'GenericReportListCtrl'
      })
      .when('/assigned-to/:id/:name', {
        templateUrl: 'views/simple-report-list.html',
        controller: 'AssignedToCtrl'
      })
      .when('/select-media-to-publish/:type/:id', {
        templateUrl: 'views/select-media-to-publish.html',
        controller: 'SelectMediaToPublishCtrl'
      })
      .when('/reports-in-coverage/:uniqueId', {
        templateUrl: 'views/simple-report-list.html',
        controller: 'ReportsInCoverageCtrl'
      })
      .when('/associate-alias/:aliasId/:identityId', {
        templateUrl: 'views/associate-alias.html',
        controller: 'AssociateAliasCtrl'
      })
      .when('/identity-record/:id?', {
        templateUrl: 'views/identity-record.html',
        controller: 'IdentityRecordCtrl'
      })
      .when('/list-identity-records/:aliasId?', {
        templateUrl: 'views/list-identity-records.html',
        controller: 'ListIdentityRecordsCtrl'
      })
      // session identifiers may contain slashes, thus the eager match
      .when('/session/:session*', {
        templateUrl: 'views/session.html',
        controller: 'SessionCtrl'
      })
      .when('/list-from-the-web/', {
        templateUrl: 'views/list-from-the-web.html',
        controller: 'ListFromTheWebCtrl'
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
      .when('/configure-status-presentation', {
        templateUrl: 'views/configure-status-presentation.html',
        controller: 'ConfigureStatusPresentationCtrl'
      })
      .when('/configure-coverages', {
        templateUrl: 'views/configure-coverages.html',
        controller: 'ConfigureCoveragesCtrl'
      })
      .when('/configure-twitter-ingestion-oauths', {
        templateUrl: 'views/configure-twitter-ingestion-oauths.html',
        controller: 'ConfigureTwitterIngestionOauthsCtrl'
      })
      .when('/configure-lists', {
        templateUrl: 'views/configure-lists.html',
        controller: 'ConfigureListsCtrl'
      })
      .when('/configure-lists-specific', {
        templateUrl: 'views/configure-lists-specific.html',
        controller: 'ConfigureListsSpecificCtrl'
      })
      .when('/configure-time-zone', {
        templateUrl: 'views/configure-time-zone.html',
        controller: 'ConfigureTimeZoneCtrl'
      })
      .when('/edit-user-lists', {
        templateUrl: 'views/edit-user-lists.html',
        controller: 'EditUserListsCtrl'
      })
      .when('/new-twitter-search', {
        templateUrl: 'views/new-twitter-search.html',
        controller: 'NewTwitterSearchCtrl'
      })
      .when('/assigned-to-me', {
        templateUrl: 'views/assigned-to-me.html',
        controller: 'AssignedToMeCtrl'
      })
      .when('/assign/', {
        templateUrl: 'views/assign.html',
        controller: 'AssignCtrl'
      })
      .when('/assigned/', {
        templateUrl: 'views/assigned.html',
        controller: 'AssignedCtrl'
      })
      .when('/queues/', {
        templateUrl: 'views/queues.html',
        controller: 'QueuesCtrl'
      })
      .when('/my-monitor/', {
        templateUrl: 'views/my-monitor.html',
        controller: 'MyMonitorCtrl'
      })
      .when('/processed-queues', {
        templateUrl: 'views/processed-queues.html',
        controller: 'ProcessedQueuesCtrl'
      })
      .when('/ingest-from-location', {
        templateUrl: 'views/ingest-from-location.html',
        controller: 'IngestFromLocationCtrl'
      })
      // static pages, without controllers
      .when('/error-no-monitors', {
        templateUrl: 'views/error-no-monitors.html'
      })
      .when('/error-no-searches', {
        templateUrl: 'views/error-no-searches.html'
      })
      .when('/help-tweet-queues', {
        templateUrl: 'views/help-tweet-queues.html'
      })
      .otherwise({
        redirectTo: '/assigned-to-me'
      });
  }]).run(['gettextCatalog', 'Raven', 'initAuth', function(gettextCatalog, Raven, initAuth){
    // the annotations above are currently not automatically managed
    // by the building process, while the others are
    
    //gettextCatalog.currentLanguage = 'it_IT';
    gettextCatalog.debug = true;
    Raven.install();
    initAuth();
  }]);
