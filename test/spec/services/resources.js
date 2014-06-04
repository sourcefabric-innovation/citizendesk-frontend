'use strict';

describe('Service: Resources', function () {

  // load the service's module
  beforeEach(module('citizendeskFrontendApp'));

  // instantiate service
  var Resources;
  beforeEach(inject(function (_Resources_) {
    Resources = _Resources_;
  }));

  it('should do something', function () {
    expect(!!Resources).toBe(true);
  });

});
