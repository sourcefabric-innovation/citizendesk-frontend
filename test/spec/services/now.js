'use strict';

describe('Service: Now', function () {

  // load the service's module
  beforeEach(module('citizendeskFrontendApp'));

  // instantiate service
  var now;
  beforeEach(inject(function (_now_) {
    now = _now_;
  }));

  it('produces a timestamp', function () {
    expect(typeof now()).toBe('number');
  });

});
