'use strict';

describe('Service: ExceptionHandler', function () {

  // load the service's module
  beforeEach(module('citizendeskFrontendApp'));

  // instantiate service
  var ExceptionHandler;
  beforeEach(inject(function (_$exceptionHandler_) {
    ExceptionHandler = _$exceptionHandler_;
  }));

  it('captures exceptions', inject(function (Raven) {
    spyOn(Raven.raven, 'captureException');
    ExceptionHandler('i am an exception');
    expect(Raven.raven.captureException).toHaveBeenCalled();
  }));
});
