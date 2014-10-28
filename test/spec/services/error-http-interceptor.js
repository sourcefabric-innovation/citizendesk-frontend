'use strict';

describe('Service: ErrorHttpInterceptor', function () {

  // load the service's module
  beforeEach(module('citizendeskFrontendApp'));

  // instantiate service
  var ErrorHttpInterceptor,
      Raven;
  beforeEach(inject(function (_errorHttpInterceptor_, _Raven_) {
    ErrorHttpInterceptor = _errorHttpInterceptor_;
    Raven = _Raven_;
    Raven.raven.captureException = jasmine.createSpy('raven capture');
  }));

  it('should do something', function () {
    expect(!!ErrorHttpInterceptor).toBe(true);
  });
  it('intercepts an Eve error', function() {
    ErrorHttpInterceptor.response({
      data: {
        _status: 'ERR'
      },
      config: {}
    });
    expect(Raven.raven.captureException).toHaveBeenCalled();
  });
});
