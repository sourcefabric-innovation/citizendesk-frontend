'use strict';

describe('Service: InitAuth', function () {

  // load the service's module
  beforeEach(module('citizendeskFrontendApp'));

  // instantiate service
  var initAuth;
  beforeEach(inject(function (_initAuth_) {
    initAuth = _initAuth_;
  }));

  it('reloads after getting the identity', inject(function ($rootScope, $http, session, $route, $q) {
    delete session.token;
    spyOn(session, 'getIdentity').andReturn($q.when());
    spyOn($route, 'reload');
    initAuth.onLocationChange({ preventDefault:function(){} });
    session.token = '<token>';
    $rootScope.$digest();
    expect($http.defaults.headers.common.Authorization).toBe('Basic bnVsbDo=');
    expect($route.reload).toHaveBeenCalled();
  }));
});
