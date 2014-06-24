'use strict';

describe('Service: InitAuth', function () {

  // load the service's module
  beforeEach(module('citizendeskFrontendApp'));

  // instantiate service
  var InitAuth;
  beforeEach(inject(function (_initAuth_) {
    InitAuth = _initAuth_;
  }));

  it('should do something', function () {
    expect(!!InitAuth).toBe(true);
  });

});
