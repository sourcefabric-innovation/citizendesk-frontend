'use strict';

describe('Service: Reports', function () {

  // load the service's module
  beforeEach(module('citizendeskFrontendApp'));

  // instantiate service
  var Reports;
  beforeEach(inject(function (_Reports_) {
    Reports = _Reports_;
    Reports.$sails = globals.sails;
  }));

  it('should do something', function () {
    expect(!!Reports).toBe(true);
  });

});
