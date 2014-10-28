'use strict';

describe('Service: allPages', function () {

  // load the service's module
  beforeEach(module('citizendeskFrontendApp'));

  // instantiate service
  var allPages;
  beforeEach(inject(function (_allPages_) {
    allPages = _allPages_;
  }));

  it('should do something', function () {
    expect(!!allPages).toBe(true);
  });
});
