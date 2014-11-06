'use strict';

describe('Service: reportStatuses', function () {

  // load the service's module
  beforeEach(module('citizendeskFrontendApp'));

  // instantiate service
  var reportStatuses,
      api,
      $rootScope;

  beforeEach(inject(function(_api_, _$rootScope_){
    api = _api_;
    spyOn(api.report_statuses, 'query').and.callThrough();
    $rootScope = _$rootScope_;
  }));
  beforeEach(inject(function (_reportStatuses_) {
    reportStatuses = _reportStatuses_;
  }));

  it('gives statuses', function () {
    expect(reportStatuses('debunked')).toBe('debunked');
    expect(reportStatuses('')).toBe('');
  });
});
