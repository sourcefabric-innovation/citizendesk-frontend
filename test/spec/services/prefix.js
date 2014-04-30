'use strict';

describe('Service: Prefix', function () {

  // load the service's module
  beforeEach(module('citizendeskFrontendApp'));

  // instantiate service
  var Prefix;
  beforeEach(inject(function (_prefix_) {
    Prefix = _prefix_;
  }));

  it('should do something', function () {
    expect(!!Prefix).toBe(true);
  });

});
