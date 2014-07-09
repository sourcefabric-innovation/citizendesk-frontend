'use strict';

/* see also
https://github.com/bertramdev/angular-cachebuster/blob/master/cacheBuster.js
*/

describe('Service: CacheBuster', function () {

  // load the service's module
  beforeEach(module('citizendeskFrontendApp'));

  // instantiate service
  var CacheBuster;
  beforeEach(inject(function (_cacheBuster_) {
    CacheBuster = _cacheBuster_;
  }));

  it('should do something', function () {
    expect(!!CacheBuster).toBe(true);
  });

});
