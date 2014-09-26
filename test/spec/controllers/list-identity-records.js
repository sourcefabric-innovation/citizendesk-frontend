'use strict';

describe('Controller: ListIdentityRecordsCtrl', function () {

  // load the controller's module
  beforeEach(module('citizendeskFrontendApp'));

  var scope,
      api,
      $q,
      $location;

  beforeEach(inject(function (_api_, _$location_) {
    api = _api_;
    spyOn(api.identity_records, 'query').andCallThrough();
    $location = _$location_;
    spyOn($location, 'url');
  }));
  function common() {
    it('asks for identities', function () {
      expect(api.identity_records.query).toHaveBeenCalled();
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
      expect(scope.configurationNavigation).toBeFalsy();
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
      expect($location.url.calls.length).toBe(1);
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
      expect(scope.configurationNavigation).toBeTruthy();
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
