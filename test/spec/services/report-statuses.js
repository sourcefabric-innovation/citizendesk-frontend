'use strict';

describe('Service: reportStatuses', function () {

  // load the service's module
  beforeEach(module('citizendeskFrontendApp'));

  // instantiate service
  var ReportStatuses,
      api,
      $rootScope;

  beforeEach(inject(function(_api_, _$rootScope_){
    api = _api_;
    spyOn(api.report_statuses, 'query').andCallThrough();
    $rootScope = _$rootScope_;
  }));
  beforeEach(inject(function (_reportStatuses_) {
    ReportStatuses = _reportStatuses_;
  }));

  it('gives statuses', function () {
    expect(ReportStatuses('debunked')).toBe('debunked');
    expect(ReportStatuses('')).toBe('');
  });
});
