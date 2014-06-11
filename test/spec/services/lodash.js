'use strict';

describe('Service: Lodash', function () {

  // load the service's module
  beforeEach(module('citizendeskFrontendApp'));

  // instantiate service
  var Lodash;
  beforeEach(inject(function (_lodash_) {
    Lodash = _lodash_;
  }));

  it('should do something', function () {
    expect(!!Lodash).toBe(true);
  });

});
