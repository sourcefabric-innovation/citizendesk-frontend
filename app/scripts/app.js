'use strict';

angular.module('citizenfrontApp', [
  'ngRoute',
  'ngResource'
])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/new-report', {
        templateUrl: 'views/new-report.html',
        controller: 'NewReportCtrl'
      })
      .when('/list-reports', {
        templateUrl: 'views/list-reports.html',
        controller: 'ReportListCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
