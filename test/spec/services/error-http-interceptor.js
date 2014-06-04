'use strict';

describe('Service: ErrorHttpInterceptor', function () {

  // load the service's module
  beforeEach(module('citizendeskFrontendApp'));

  // instantiate service
  var ErrorHttpInterceptor;
  beforeEach(inject(function (_errorHttpInterceptor_) {
    ErrorHttpInterceptor = _errorHttpInterceptor_;
  }));

  it('should do something', function () {
    expect(!!ErrorHttpInterceptor).toBe(true);
  });

});
