'use strict';

describe('Service: exceptionHandler', function () {

  // load the service's module
  beforeEach(module('citizendeskFrontendApp'));

  // instantiate service
  var exceptionHandler;
  beforeEach(inject(function (_$exceptionHandler_) {
    exceptionHandler = _$exceptionHandler_;
  }));

  it('captures exceptions', inject(function (Raven) {
    spyOn(Raven.raven, 'captureException');
    exceptionHandler('i am an exception');
    expect(Raven.raven.captureException).toHaveBeenCalled();
  }));
});
