'use strict';

describe('Service: SimpleReportList', function () {

  // load the service's module
  beforeEach(module('citizendeskFrontendApp'));

  // instantiate service
  var SimpleReportList;
  beforeEach(inject(function (_SimpleReportList_) {
    SimpleReportList = _SimpleReportList_;
  }));

  it('should do something', function () {
    expect(!!SimpleReportList).toBe(true);
  });

});
