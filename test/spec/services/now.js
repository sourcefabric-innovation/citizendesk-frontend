'use strict';

describe('Service: Now', function () {

  // load the service's module
  beforeEach(module('citizendeskFrontendApp'));

  // instantiate service
  var Now;
  beforeEach(inject(function (_now_) {
    Now = _now_;
  }));

  it('should do something', function () {
    expect(!!Now).toBe(true);
  });

});
