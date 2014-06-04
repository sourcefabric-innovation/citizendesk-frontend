'use strict';

describe('Service: Resource', function () {

  // load the service's module
  beforeEach(module('citizendeskFrontendApp'));

  // instantiate service
  var Resource;
  beforeEach(inject(function (_resource_) {
    Resource = _resource_;
  }));

  it('should do something', function () {
    expect(!!Resource).toBe(true);
  });

});
