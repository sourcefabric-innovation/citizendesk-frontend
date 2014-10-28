'use strict';

/* see also
https://github.com/bertramdev/angular-cachebuster/blob/master/cacheBuster.js
*/

describe('Service: cacheBuster', function () {

  // load the service's module
  beforeEach(module('citizendeskFrontendApp'));
  beforeEach(module(function(cacheBusterProvider) {
    cacheBusterProvider.disabled = false;
  }));
  beforeEach(module(function($provide) {
    $provide.value('now', function() { return 1414515319680; });
  }));

  // instantiate service
  var cacheBuster;
  beforeEach(inject(function (_cacheBuster_) {
    cacheBuster = _cacheBuster_;
  }));

  it('busts the cache for requests!', function () {
    var busted = cacheBuster.request({
      url: 'url'
    });
    expect(busted.url).toBe('url?cachebuster=1414515319680');
    busted = cacheBuster.request({
      url: 'url?some=param'
    });
    expect(busted.url).toBe('url?some=param&cachebuster=1414515319680');
  });
  it('ignores stuff we have in the cache', inject(function($templateCache) {
    $templateCache.get = function() { return true; };
    expect(cacheBuster.request({ url: 'cached' }).url).toBe('cached');
  }));
});
