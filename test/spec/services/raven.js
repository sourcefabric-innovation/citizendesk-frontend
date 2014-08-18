'use strict';

describe('Service: Raven', function () {

  // load the service's module
  beforeEach(module('citizendeskFrontendApp'));

  // instantiate service
  var Raven;
  beforeEach(inject(function (_Raven_) {
    Raven = _Raven_;
  }));

  xit('captures messages', function () {
    expect(Raven.raven.captureMessage).toBeDefined();
  });
  it('captures exceptions', function(){
    expect(Raven.raven.captureException).toBeDefined();
  });
});
