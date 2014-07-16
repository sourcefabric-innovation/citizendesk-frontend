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
      $httpBackend,
      $rootScope;
  beforeEach(inject(function (_$httpBackend_, _$rootScope_) {
    $httpBackend = _$httpBackend_;
    $rootScope = _$rootScope_;
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
  it('(asynchronously) fetches the list of assigned reports for every user', function() {
    Assign.updateTotals();
    var response = angular.copy(mocks.reports.list);
    response._meta = {
      "total": 10,
      "page": 1,
      "max_results": 25
    };
    $httpBackend
      .expectGET(globals.root + 'reports?where=%7B%22assignments.user_id%22:%2253b146149c616733d6e8c7d4%22%7D')
      .respond(response);
    $httpBackend.flush();
    $rootScope.$digest(); // for $q
    expect(Assign.totals['53b146149c616733d6e8c7d4']).toBe(10);
  });

});
