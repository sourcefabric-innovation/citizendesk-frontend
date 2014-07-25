'use strict';

describe('Service: Body', function () {

  // load the service's module
  beforeEach(module('citizendeskFrontendApp'));

  // instantiate service
  var Body;
  beforeEach(inject(function (_Body_) {
    Body = _Body_;
  }));

  it('should do something', function () {
    expect(!!Body).toBe(true);
  });

});
