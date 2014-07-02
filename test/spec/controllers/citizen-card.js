'use strict';
/* jshint camelcase: false */

describe('Controller: CitizenCardCtrl', function () {

  // load the controller's module
  beforeEach(module('citizendeskFrontendApp'));

  var CitizenCardCtrl,
      scope,
      $httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _$httpBackend_) {
    scope = $rootScope.$new();
    $httpBackend = _$httpBackend_;
    CitizenCardCtrl = $controller('CitizenCardCtrl', {
      $scope: scope,
      $routeParams: {
        name: 'BBCBreaking',
        authority: 'twitter'
      }
    });
    $httpBackend
      .expectGET(globals.root)
      .respond(mocks.root);
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingRequest();
    $httpBackend.verifyNoOutstandingExpectation();
  });

  describe('when an alias is available', function() {
    beforeEach(inject(function($rootScope) {
      $httpBackend
        .expectGET(globals.root + 'citizen_aliases?where=%7B%22identifiers.user_name%22:%22BBCBreaking%22,%22authority%22:%22twitter%22%7D')
        .respond(mocks.citizen_aliases.query_result);
      $httpBackend.flush();
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
      $httpBackend
        .expectGET(globals.root + 'citizen_aliases?where=%7B%22identifiers.user_name%22:%22BBCBreaking%22,%22authority%22:%22twitter%22%7D')
        .respond(mocks.citizen_aliases.empty_query_result);
      $httpBackend
        .expectPOST(globals.root + 'proxy/fetch-citizen-alias/', {
          name: 'BBCBreaking',
          authority: 'twitter'
        })
        .respond(200);
      $httpBackend
        .expectGET(globals.root + 'citizen_aliases?where=%7B%22identifiers.user_name%22:%22BBCBreaking%22,%22authority%22:%22twitter%22%7D')
        .respond(mocks.citizen_aliases.query_result);
      $httpBackend.flush();
    });
    it('adds the alias to the scope', function() {
      expect(scope.alias.locations).toEqual(['London, UK']);
    });
  });
});
