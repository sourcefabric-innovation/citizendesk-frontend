'use strict';

describe('Controller: IdentityRecordCtrl', function () {

  // load the controller's module
  beforeEach(module('citizendeskFrontendApp'));

  var IdentityRecordCtrl,
      scope,
      api,
      $window;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _api_, _$window_) {
    api = _api_;
    spyOn(api.identity_records, 'getById').and.callThrough();
    spyOn(api.identity_records, 'save').and.callThrough();
    spyOn(api.citizen_aliases, 'query').and.callThrough();
    $window = _$window_;
    spyOn($window.history, 'back');
  }));

  describe('started without id', function() {
    beforeEach(inject(function ($controller, $rootScope) {
      scope = $rootScope.$new();
      IdentityRecordCtrl = $controller('IdentityRecordCtrl', {
        $scope: scope,
        $routeParams: {}
      });
    }));
    it('does not ask for the identity and related aliases', function() {
      expect(api.identity_records.getById).not.toHaveBeenCalled();
      expect(api.citizen_aliases.query).not.toHaveBeenCalled();
    });
    it('is enabled', function() {
      expect(scope.disabled).toBeFalsy();
    });
    it('hides the delete button', function() {
      expect(scope.hideDelete).toBeTruthy();
    });
    describe('on submit', function() {
      beforeEach(function() {
        scope.submit();
      });
      it('tries to save', function() {
        expect(api.identity_records.save).toHaveBeenCalled();
      });
      it('waits for a response', function() {
        expect(scope.disabled).toBeTruthy();
      });
      describe('on save success', function() {
        beforeEach(function() {
          api.identity_records.def.save.resolve();
          scope.$digest();
        });
        it('goes back', function() {
          expect($window.history.back).toHaveBeenCalled();
        });
      });
    });
    it('cancels', function() {
      scope.cancel();
      expect($window.history.back).toHaveBeenCalled();
    });
  });
  describe('started with an id', function() {
    beforeEach(inject(function ($controller, $rootScope) {
      scope = $rootScope.$new();
      IdentityRecordCtrl = $controller('IdentityRecordCtrl', {
        $scope: scope,
        $routeParams: {
          id: 'identity id'
        }
      });
    }));
    it('asks for the identity and related aliases', function() {
      expect(api.identity_records.getById).toHaveBeenCalled();
      expect(api.citizen_aliases.query).toHaveBeenCalled();
    });
    describe('got the identity', function() {
      beforeEach(function() {
        api.identity_records.def.getById.resolve({
          _id: 'identity id',
          first_name: 'Francesco',
          last_name: 'Occhipinti'
        });
        scope.$digest();
      });
      it('exposes it through the scope', function() {
        expect(scope.identity._id).toBe('identity id');
      });
      it('enables the controls', function() {
        expect(scope.disabled).toBeFalsy();
      });
      it('deletes', function() {
        api.identity_records.reset.save();
        spyOn(api.identity_records, 'save').and.callThrough();
        scope.delete();
        expect(api.identity_records.save).toHaveBeenCalled();
      });
    });
    describe('with aliases', function() {
      beforeEach(function() {
        api.citizen_aliases.def.query.resolve({
          _items: [{}, {}]
        });
        scope.$digest();
      });
      it('disables deletion', function() {
        expect(scope.deleteDisabled).toBeTruthy();
      });
    });
    describe('without aliases', function() {
      beforeEach(function() {
        api.citizen_aliases.def.query.resolve({
          _items: []
        });
        scope.$digest();
      });
      it('enables deletion', function() {
        expect(scope.deleteDisabled).toBeFalsy();
      });
    });
  });
});
