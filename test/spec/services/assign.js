'use strict';

/*
 the user will probably jump back and forth from the assignment page,
 thus it is important to proxy data in a service in order to have a
 quick navigation
 */

describe('Service: Assign', function () {

  // load the service's module
  beforeEach(module('citizendeskFrontendApp'));

  // instantiate service
  var Assign,
      $httpBackend;
  beforeEach(inject(function (_$httpBackend_) {
    $httpBackend = _$httpBackend_;
    $httpBackend
      .expectGET(globals.root)
      .respond(mocks.root);
    $httpBackend
      .expectGET(globals.root + 'users?page=1')
      .respond(mocks.users.list);
  }));
  beforeEach(inject(function (_Assign_, $rootScope) {
    Assign = _Assign_;
    $httpBackend.flush();
  }));

  it('fetches the users', function () {
    expect(Assign.users.length).toBe(4);
  });

});
