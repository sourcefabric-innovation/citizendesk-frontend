'use strict';

describe('Controller: GenericReportListCtrl', function () {

  // load the controller's module
  beforeEach(module('citizendeskFrontendApp'));

  globals.simpleListControllerTest('GenericReportListCtrl', {
    query: 'published_debunked'
  });
});
