'use strict';

describe('Service: Session', function () {

  // load the service's module
  beforeEach(module('citizendeskFrontendApp'));

  // instantiate service
  var Session;
  beforeEach(inject(function (_session_) {
    Session = _session_;
  }));

  var SESSION = {
    token: 'abcd',
    _links: {
      self: {href: 'delete_session_url'}
    }
  };

  beforeEach(function() {
    localStorage.clear();
  });

  it('has identity and token property', inject(function (session) {
    expect(session.token).toBe(null);
    expect(session.identity).toBe(null);
  }));

  it('can be started', inject(function (session) {
    session.start(SESSION, {name: 'user'});
    expect(session.token).toBe(SESSION.token);
    expect(session.identity.name).toBe('user');
  }));

  it('can be set expired', inject(function (session) {
    session.start(SESSION, {name: 'foo'});
    session.expire();
    expect(session.token).toBe(null);
    expect(session.identity.name).toBe('foo');
  }));

  it('can resolve identity on start', inject(function (session, $rootScope) {
    var identity;

    session.getIdentity().then(function (_identity) {
      identity = _identity;
    });

    session.getIdentity().then(function (i2) {
      expect(identity).toBe(i2);
    });

    session.start(SESSION, {name: 'foo'});

    $rootScope.$apply();
    expect(identity.name).toBe('foo');
  }));

  /*
  it('can store state for future requests', inject(function (session, $injector, $rootScope) {
    session.start(SESSION, {name: 'bar'});

    var nextSession = $injector.instantiate(SessionService);

    $rootScope.$apply();

    expect(nextSession.token).toBe(SESSION.token);
    expect(nextSession.identity.name).toBe('bar');

    nextSession.expire();
    $rootScope.$apply();

    expect(session.token).toBe(null);
    expect(session.identity.name).toBe('bar');
  }));
   */

  it('can clear session', inject(function (session) {
    session.start(SESSION, {name: 'bar'});
    session.clear();
    expect(session.token).toBe(null);
    expect(session.identity).toBe(null);
  }));

  it('can persist session delete href', inject(function (session) {
    session.start(SESSION, {name: 'bar'});
    expect(session.getSessionHref()).toBe(SESSION._links.self.href);
  }));

  /*
  it('can update identity', inject(function (session, $injector, $rootScope) {
    session.start(SESSION, {name: 'bar'});
    session.updateIdentity({name: 'baz'});
    expect(session.identity.name).toBe('baz');

    var nextSession = $injector.instantiate(SessionService);
    $rootScope.$apply();
    expect(nextSession.identity.name).toBe('baz');
  }));
   */
});
