'use strict';

describe('Service: Raven', function () {

  // load the service's module
  beforeEach(module('citizenfrontApp'));

  // instantiate service
  var Raven;
  beforeEach(inject(function (_Raven_) {
    Raven = _Raven_;
  }));

  xit('should do something', function () {
    expect(!!Raven.raven.captureMessage('test')).toBe(true);
  });

});
