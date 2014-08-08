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
      $rootScope,
      api;
  beforeEach(inject(function (_$httpBackend_, _$rootScope_, _api_) {
    $httpBackend = _$httpBackend_;
    $rootScope = _$rootScope_;
    api = _api_;
    spyOn(api.users, 'query').andCallThrough();
    api.users.def.query.resolve(mocks.users.list);
  }));
  beforeEach(inject(function (_Assign_, $rootScope) {
    Assign = _Assign_;
    $rootScope.$digest();
  }));

  it('fetches the users', function () {
    expect(Assign.users.length).toBe(4);
  });
  it('(asynchronously) fetches the list of assigned reports for every user', function() {
    api.reports.reset.query();
    Assign.updateTotals();
    var response = angular.copy(mocks.reports.list);
    response._meta = {
      "total": 10,
      "page": 1,
      "max_results": 25
    };
    api.reports.def.query.resolve(response);
    $rootScope.$digest(); // for $q
    expect(Assign.totals['53b146149c616733d6e8c7d4']).toBe(10);
  });

});
