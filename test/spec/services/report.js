'use strict';

/* the report pages and controllers depend on the report type, but
they have some common logic, which is contained in this service */

describe('Service: Report', function () {

  var Report,
      $httpBackend,
      $rootScope,
      api = { reports: {}},
      coverage = {
        _id: 'coverage id',
        uuid: 'coverage unique id'
      },
      reportsSaveDeferred,
      initAuth = function(){},
      $window = {},
      session = {
        identity: angular.copy(mocks.auth.success)
      };

  // load the service's module
  beforeEach(module('citizendeskFrontendApp'));
  // mock dependencies
  beforeEach(module(function($provide) {
    $provide.value('session', session);
    /* playing with `$http` triggers somehow `$locationChangeStart`,
    which triggers the authentication and raises an error. replacing
    the autenthication with this empty function */
    $provide.value('initAuth', initAuth);
    $provide.value('api', api);
    $provide.value('$window', $window);
  }));
  beforeEach(inject(function (_Report_, _$httpBackend_, _$rootScope_, $q) {
    Report = _Report_;
    $httpBackend = _$httpBackend_;
    $rootScope = _$rootScope_;
    reportsSaveDeferred = $q.defer();
    api.reports.save = function(){};
    spyOn(api.reports, 'save').andReturn(reportsSaveDeferred.promise);
  }));

  it('creates a report', function() {
    var newReport = Report.create({
      session: 'abcde'
    });
    expect(newReport.authors[0].identifiers.user_name)
      .toBe('53bab5339c61671f63bc3788');
    expect(newReport.notices_outer)
      .toEqual([]);
  });
});
