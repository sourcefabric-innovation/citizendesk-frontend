'use strict';

describe('Service: ErrorHttpInterceptor', function () {

  // load the service's module
  beforeEach(module('citizendeskFrontendApp'));

  // instantiate service
  var ErrorHttpInterceptor,
      Raven,
      ErrorPolice;
  beforeEach(inject(function (_errorHttpInterceptor_, _Raven_, _ErrorPolice_) {
    ErrorHttpInterceptor = _errorHttpInterceptor_;
    Raven = _Raven_;
    ErrorPolice = _ErrorPolice_;
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
  it('just returns matching keys if the error is known', inject(function($rootScope) {
    spyOn(ErrorPolice, 'identify').and.returnValue(['known']);
    var messages;
    ErrorHttpInterceptor
      .responseError({ a: { known: { one: {}}}})
      .catch(function(_messages_) {
        messages = _messages_;
      });
    $rootScope.$digest();
    expect(messages).toEqual(['known']);
  }));
});
