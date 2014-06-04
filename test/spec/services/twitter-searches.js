'use strict';

describe('Service: TwitterSearches', function () {

  // load the service's module
  beforeEach(module('citizendeskFrontendApp'));

  // instantiate service
  var TwitterSearches;
  beforeEach(inject(function (_TwitterSearches_) {
    TwitterSearches = _TwitterSearches_;
  }));

  it('has a create method', function () {
    expect(TwitterSearches.create).toBeDefined();
  });

});
