'use strict';

describe('Controller: ConfigureTwitterIngestionOauthsCtrl', function () {

  // load the controller's module
  beforeEach(module('citizendeskFrontendApp'));

  var ConfigureTwitterIngestionOauthsCtrl,
      scope,
      $q,
      api;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _$q_, _api_) {
    $q = _$q_;
    api = _api_;
    scope = $rootScope.$new();
    spyOn(api.twt_oauths, 'query').and.callThrough();
    spyOn(api.twt_oauths, 'save').and.callThrough();
    ConfigureTwitterIngestionOauthsCtrl = $controller('ConfigureTwitterIngestionOauthsCtrl', {
      $scope: scope,
      session: {
        identity: {
          _id: 'test user id'
        }
      }
    });
  }));

  it('asks for keys', function () {
    expect(api.twt_oauths.query).toHaveBeenCalled();
  });
  it('when receives no keys writes it down', function() {
    api.twt_oauths.def.query.resolve({_items: []});
    scope.$digest();
    expect(scope.noKey).toBeTruthy();
  });
  it('adds a key', function(){
    scope.add();
    expect(scope.key).toBeDefined();
    expect(scope.noKey).toBeFalsy();
  });
  describe('after receiving the keys', function() {
    beforeEach(function() {
      api.twt_oauths.def.query.resolve(angular.copy(mocks.twt_oauths.list));
      scope.$digest();
    });
    it('has a key', function() {
      expect(scope.key).toBeTruthy();
      expect(scope.key.spec.consumer_key).toBeDefined();
    });
    it('is disabled', function() {
      expect(scope.disabled).toBeTruthy();
    });
    describe('on edit', function() {
      beforeEach(function() {
        scope.edit();
      });
      it('gets enabled', function() {
        expect(scope.disabled).toBeFalsy();
      });
      it('clears the model', function(){
        expect(scope.key.spec.consumer_key).not.toBeDefined();
      });
      it('saves', function() {
        scope.save();
        api.twt_oauths.def.save.resolve();
        scope.$digest();
        expect(scope.editing).toBeFalsy();
      });
      describe('on edit cancel', function() {
        beforeEach(function() {
          scope.cancelEdit();
        });
        it('restores the received key in the scope', function() {
          expect(scope.key.spec.consumer_key).toBeDefined();
        });
      });
    });
  });
});
