'use strict';

describe('Service: ExceptionHandler', function () {

  // load the service's module
  beforeEach(module('citizendeskFrontendApp'));

  // instantiate service
  var ExceptionHandler;
  beforeEach(inject(function (_$exceptionHandler_) {
    ExceptionHandler = _$exceptionHandler_;
  }));

  it('should do something', function () {
    expect(!!ExceptionHandler).toBe(true);
  });

});
