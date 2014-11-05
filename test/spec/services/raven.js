'use strict';

describe('Service: Raven', function () {

  var onRavenSuccess;
  // load the service's module
  beforeEach(module('citizendeskFrontendApp'));
  beforeEach(module(function($provide) {
    onRavenSuccess = jasmine.createSpy('on raven success');
    $provide.value('onRavenSuccess', onRavenSuccess);
  }));
  beforeEach(module(function(RavenProvider) {
    RavenProvider.disabled = false;
  }));

  // the `raven` library can be configured just once, so we cannot
  // initialise the service in a `beforeEach` like usual, we have to
  // execute all the tests at once
  it('behaves', inject(function (Raven, $window, session) {
    expect(Raven.raven.captureMessage).toBeDefined();
    expect(Raven.raven.captureException).toBeDefined();
    expect(Raven.dataCallback({}).tags.username)
      .toBe('username not available because of missing identity');
    session.identity = { username: 'Rachel' };
    expect(Raven.dataCallback({}).tags.username)
      .toBe('Rachel');
  }));
});
