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
      .otherwise({
        redirectTo: '/list-reports'
      });
    $sailsProvider.url = 'http://martin.sourcefabric.net:1337';
  }]);
