'use strict';

describe('Service: AuthInterceptor', function () {

  // load the service's module
  beforeEach(module('citizendeskFrontendApp'));

  // instantiate service
  var AuthInterceptor;
  beforeEach(inject(function (_AuthInterceptor_) {
    AuthInterceptor = _AuthInterceptor_;
  }));

  // reusing the test for two different methods
  ['response', 'responseError'].map(function(method) {
    it('should intercept 401 '+method+', run auth and resend request', inject(function($rootScope, session, $q, $httpBackend) {

      var config = {
        method: 'GET',
        url: 'test',
        headers: {}
      };
      var response = {
        status: 401,
        config: config
      };

      spyOn(session, 'expire');
      spyOn(session, 'getIdentity').and.callThrough();

      $httpBackend.expectGET('test').respond();

      // resolving just the first `getIdentity` promise, otherwise a
      // loop of location changes will happen (probably due to event
      // handling in the `initAuth` service) and it will scare you
      var called;
      session.getIdentity = function() {
        if (called) {
          return $q.defer().promise;
        } else {
          called = true;
          return $q.when();
        }
      };

      AuthInterceptor[method](response);

      $rootScope.$digest();

      expect(session.expire).toHaveBeenCalled();

      $httpBackend.flush();
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    }));
  });
});
