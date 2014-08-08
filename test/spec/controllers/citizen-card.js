'use strict';
/* jshint camelcase: false */

describe('Controller: CitizenCardCtrl', function () {

  // load the controller's module
  beforeEach(module('citizendeskFrontendApp'));

  var CitizenCardCtrl,
      scope,
      $httpBackend,
      api;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _$httpBackend_, _api_) {
    scope = $rootScope.$new();
    $httpBackend = _$httpBackend_;
    api = _api_;
    spyOn(api.citizen_aliases, 'query').andCallThrough();
    CitizenCardCtrl = $controller('CitizenCardCtrl', {
      $scope: scope,
      $routeParams: {
        name: 'BBCBreaking',
        authority: 'twitter'
      }
    });
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingRequest();
    $httpBackend.verifyNoOutstandingExpectation();
  });

  describe('when an alias is available', function() {
    beforeEach(inject(function($rootScope) {
      api.citizen_aliases.def.query
        .resolve(mocks.citizen_aliases.query_result);
      scope.$digest();
    }));
    it('gets items in the response', function() {
      expect(scope.response._items).toBeDefined();
    });
    it('gets links in the response', function() {
      expect(scope.response._links).toBeDefined();
    });
    it('gets meta in the response', function() {
      expect(scope.response._meta).toBeDefined();
    });
    it('adds the alias to the scope', function() {
      expect(scope.alias.locations).toEqual(['London, UK']);
    });
  });

  describe('when an alias is not available', function() {
    beforeEach(function() {
      api.citizen_aliases.def.query
        .resolve(mocks.citizen_aliases.empty_query_result);
      $httpBackend
        .expectPOST(globals.root + 'proxy/fetch-citizen-alias/', {
          name: 'BBCBreaking',
          authority: 'twitter'
        })
        .respond(200);
      scope.$digest(); // resolve the first promise
      api.citizen_aliases.reset.query(); // prepare a fresh promise
      $httpBackend.flush(); // respond to the HTTP request
      api.citizen_aliases.def.query
        .resolve(mocks.citizen_aliases.query_result);
      scope.$digest();
    });
    it('adds the alias to the scope', function() {
      expect(scope.alias.locations).toEqual(['London, UK']);
    });
  });
});
