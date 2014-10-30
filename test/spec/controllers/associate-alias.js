'use strict';

describe('Controller: AssociateAliasCtrl', function () {

  // load the controller's module
  beforeEach(module('citizendeskFrontendApp'));

  var AssociateAliasCtrl,
      scope,
      api,
      $window;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _api_, _$window_) {
    api = _api_;
    spyOn(api.identity_records, 'getById').andCallThrough();
    spyOn(api.citizen_aliases, 'getById').andCallThrough();
    spyOn(api.citizen_aliases, 'save').andCallThrough();
    $window = _$window_;
    spyOn($window.history, 'go');
    spyOn($window.history, 'back');

    scope = $rootScope.$new();
    AssociateAliasCtrl = $controller('AssociateAliasCtrl', {
      $scope: scope,
      $routeParams: {
        aliasId: 'alias id',
        identityId: 'identity id'
      }
    });
  }));

  it('is initially loading', function () {
    expect(scope.loading).toBeTruthy();
  });
  it('asks for the alias', function() {
    expect(api.citizen_aliases.getById).toHaveBeenCalledWith('alias id');
  });
  it('asks for the alias', function() {
    expect(api.identity_records.getById).toHaveBeenCalledWith('identity id');
  });
  describe('got the data', function() {
    beforeEach(function() {
      api.citizen_aliases.def.getById.resolve({
        _id: 'alias id'
      });
      api.identity_records.def.getById.resolve({
        _id: 'identity id'
      });
      scope.$digest();
    });
    it('is not loading anymore', function() {
      expect(scope.loading).toBeFalsy();
    });
    describe('on confirm', function() {
      beforeEach(function() {
        scope.confirm();
      });
      it('disables', function() {
        expect(scope.disabled).toBeTruthy();
      });
      it('requires to associate', function() {
        var toBeSaved = api.citizen_aliases.save.mostRecentCall.args[0];
        expect(toBeSaved.identity_record_id).toBeDefined();
      });
      describe('on association success', function() {
        beforeEach(function() {
          api.citizen_aliases.def.save.resolve();
          scope.$digest();
        });
        it('goes back twice', function() {
          expect($window.history.go).toHaveBeenCalledWith(-2);
        });
      });
    });
  });
  it('cancels', function() {
    scope.cancel();
    expect($window.history.back).toHaveBeenCalled();
  });
});
