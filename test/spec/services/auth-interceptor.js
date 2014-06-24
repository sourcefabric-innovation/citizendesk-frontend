'use strict';

describe('Service: AuthInterceptor', function () {

  // load the service's module
  beforeEach(module('citizendeskFrontendApp'));

  // instantiate service
  var AuthInterceptor;
  beforeEach(inject(function (_AuthInterceptor_) {
    AuthInterceptor = _AuthInterceptor_;
  }));

  it('should intercept 401 response, run auth and resend request', inject(function($rootScope, session, $q, $httpBackend) {

    var config = {method: 'GET', url: 'test', headers: {}},
        response = {status: 401, config: config};

    spyOn(session, 'expire').andCallThrough();
    spyOn(session, 'getIdentity').andCallThrough();

    AuthInterceptor.response(response);

    $rootScope.$digest();

    expect(session.expire).toHaveBeenCalled();

    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  }));

});
