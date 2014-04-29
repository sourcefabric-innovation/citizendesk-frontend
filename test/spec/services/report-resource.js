'use strict';

describe('Service: ReportResource', function () {

  // load the service's module
  beforeEach(module('citizendeskFrontendApp'));

  // instantiate service
  var ReportResource;
  beforeEach(inject(function (_reportResource_) {
    ReportResource = _reportResource_;
  }));

  it('can create reports', function () {
    var report = new ReportResource({});
    expect(report.$save).toBeDefined();
  });

});
