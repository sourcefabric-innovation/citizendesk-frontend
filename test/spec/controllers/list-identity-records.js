'use strict';

describe('Controller: ListIdentityRecordsCtrl', function () {

  // load the controller's module
  beforeEach(module('citizendeskFrontendApp'));

  var scope,
      api,
      $location,
      $window;

  beforeEach(inject(function (_api_, _$location_, _$window_) {
    api = _api_;
    spyOn(api.identity_records, 'query').and.callThrough();
    spyOn(api.citizen_aliases, 'replace').and.callThrough();
    $location = _$location_;
    spyOn($location, 'url');
    $window = _$window_;
    spyOn($window.history, 'back');
  }));
  function common() {
    it('asks for identities', function () {
      expect(api.identity_records.query).toHaveBeenCalled();
    });
    it('attaches identities to the scope', function() {
      api.identity_records.def.query.resolve({
        _items: 'items'
      });
      scope.$digest();
      expect(scope.identities).toBe('items');
    });
    it('leads the user to an identity creation page', function(){
      scope.add();
      expect($location.url).toHaveBeenCalled();
    });
  }
  describe('with an alias to assign the identity to', function() {
    beforeEach(inject(function ($controller, $rootScope) {
      scope = $rootScope.$new();
      $controller('ListIdentityRecordsCtrl', {
        $scope: scope,
        $routeParams: {
          aliasId: 'alias id'
        },
        $location: $location
      });
    }));
    common();
    it('does not show the configuration navigation', function() {
      expect(scope.configuration).toBeFalsy();
    });
    it('assigns the identity on select', function() {
      scope.select({
        _id: 'identity id'
      });
      expect($location.url).toHaveBeenCalledWith('/associate-alias/alias id/identity id');
    });
    it('changes location just once on select', function() {
      scope.select({
        _id: 'identity id'
      });
      expect($location.url.calls.count()).toBe(1);
    });
    describe('dissociating', function() {
      beforeEach(function() {
        api.citizen_aliases.def.getById.resolve({
          _links: {
            self: {
              href: '/identity_records/5436b1119c6167604098427d'
            }
          }
        });
        scope.$digest();
        scope.dissociate();
      });
      it('asks for the right resource', function() {
        expect(api.citizen_aliases.replace).toHaveBeenCalled();
      });
      it('disables while waiting', function() {
        expect(scope.disabled).toBeTruthy();
      });
      it('navigates back on success', function() {
        api.citizen_aliases.def.replace.resolve();
        scope.$digest();
        expect($window.history.back).toHaveBeenCalled();
      });
    });
  });
  describe('without an alias to assign the identity to', function() {
    beforeEach(inject(function ($controller, $rootScope) {
      scope = $rootScope.$new();
      $controller('ListIdentityRecordsCtrl', {
        $scope: scope,
        $routeParams: {},
        $location: $location
      });
    }));
    common();
    it('shows the configuration navigation', function() {
      expect(scope.configuration).toBeTruthy();
    });
    it('goes to the identity page on select', function() {
      scope.select({
        _id: 'identity id'
      });
      expect($location.url)
        .toHaveBeenCalledWith('/identity-record/identity id');
    });
  });
});
