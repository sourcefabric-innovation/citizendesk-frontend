'use strict';

describe('Service: Now', function () {

  // load the service's module
  beforeEach(module('citizendeskFrontendApp'));

  // instantiate service
  var Now;
  beforeEach(inject(function (_now_) {
    Now = _now_;
  }));

  it('produces a timestamp', function () {
    expect(typeof Now()).toBe('number');
  });

});
