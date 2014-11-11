'use strict';

describe('Service: auth', function () {

  var SESSION = 'RIr89qFZlvvtTIpe8PiPtcs2YL4g1X80cDBCdUlR',
      USERNAME = 'foo',
      $rootScope;

  /**
   * Mock auth adapter which will authenticate admin:admin and fail otherwise
   */
  function AuthAdapterMock($q) {

    /**
     * Mock auth - authenticate with admin:admin
     */
    this.authenticate = function(username, password) {
      var defer = $q.defer();

      if (username === 'admin' && password === 'admin') {
        defer.resolve(mocks.auth.success);
      } else {
        defer.reject();
      }

      return defer.promise;
    };
  }

  // load the service's module
  beforeEach(module('citizendeskFrontendApp'));
  beforeEach(module(function(authProvider) {
    authProvider.disabled = false;
  }));

  beforeEach(module(function($provide) {
    $provide.service('authAdapter', AuthAdapterMock);
  }));

  // instantiate service
  var auth;
  beforeEach(inject(function (_auth_, _$rootScope_, session) {
    auth = _auth_;
    $rootScope = _$rootScope_;
    session.clear();
  }));

  it('can login', inject(function(auth, session, $httpBackend, $rootScope, api) {

    expect(session.identity).toBe(null);
    expect(session.token).toBe(null);

    var resolved = {};

    api.users.def.getById.resolve({username: USERNAME});

    session.getIdentity().then(function() {
      resolved.identity = true;
    });

    auth.login('admin', 'admin').then(function() {
      expect(session.identity.username).toBe(USERNAME);
      expect(session.token).toBe(SESSION);
      resolved.login = true;
    });

    $rootScope.$digest();

    expect(resolved.login).toBe(true);
    expect(resolved.identity).toBe(true);
  }));

  it('checks credentials', inject(function(auth, $rootScope) {
    var resolved = false, rejected = false;

    auth.login('wrong', 'credentials').then(function() {
      resolved = true;
    }, function() {
      rejected = true;
    });

    $rootScope.$apply();
    expect(resolved).toBe(false);
    expect(rejected).toBe(true);
  }));
  it('clears the session', inject(function(session) {
    session.getSessionHref = function() { return 'href'; };
    spyOn(session, 'clear');
    auth.logout();
    expect(session.clear).toHaveBeenCalled();
  }));
});
