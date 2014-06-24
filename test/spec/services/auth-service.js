'use strict';

describe('Service: AuthService', function () {

  var USER_HREF = 'http://user/1',
      SESSION = 'sess',
      USERNAME = 'foo';

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
        defer.resolve({token: SESSION, user: '1', _links: {self: {href: 'delete_session_url'}}});
      } else {
        defer.reject();
      }

      return defer.promise;
    };
  }

  // load the service's module
  beforeEach(module('citizendeskFrontendApp'));

  beforeEach(module(function($provide) {
    $provide.service('authAdapter', AuthAdapterMock);
  }));

  // instantiate service
  var AuthService;
  beforeEach(inject(function (_auth_, session) {
    AuthService = _auth_;
    session.clear();
  }));

  xit('can login', inject(function(auth, session, $httpBackend, $rootScope) {

    expect(session.identity).toBe(null);
    expect(session.token).toBe(null);

    var resolved = {};

    $httpBackend.expectGET(USER_HREF).respond({username: USERNAME});

    session.getIdentity().then(function() {
      resolved.identity = true;
    });

    auth.login('admin', 'admin').then(function() {
      expect(session.identity.username).toBe(USERNAME);
      expect(session.token).toBe(SESSION);
      resolved.login = true;
    });

    $rootScope.$apply();

    expect(resolved.login).toBe(true);
    expect(resolved.identity).toBe(true);
  }));

  xit('checks credentials', inject(function(auth, $rootScope) {
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

});
