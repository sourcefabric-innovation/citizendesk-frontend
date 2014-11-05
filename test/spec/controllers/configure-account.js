'use strict';

describe('Controller: ConfigureAccountCtrl', function () {

  // load the controller's module
  beforeEach(module('citizendeskFrontendApp'));

  var ConfigureAccountCtrl,
      scope,
      session = {
        identity: {
          _id: 'abcdef',
          username: 'Leila'
        }
      },
      auth = {},
      api,
      $timeout,
      $window;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $q, _$timeout_, _api_, _$window_) {
    scope = $rootScope.$new();
    ConfigureAccountCtrl = $controller('ConfigureAccountCtrl', {
      $scope: scope,
      session: session,
      auth: auth
    });
    scope.$digest(); // to process the `getIdentity` resolution
    auth.def = $q.defer();
    auth.login = function() { return auth.def.promise; };
    spyOn(auth, 'login').and.callThrough();
    auth.logout = jasmine.createSpy('auth logout');
    $timeout = _$timeout_;
    api = _api_;
    spyOn(api.users, 'update').and.callThrough();
    $window = _$window_;
    spyOn($window.history, 'back');
  }));

  it('cancels', function () {
    expect(scope.cancel).toBeDefined();
  });
  it('detects when passwords match', function() {
    scope.newPassword     = 'new';
    scope.confirmPassword = 'new';
    scope.watch();
    expect(scope.mismatch).toBe(false);
    expect(scope.messages.passwordMismatch).toBe(false);
  });
  it('detects when passwords do not match', function() {
    scope.newPassword     = 'new';
    scope.confirmPassword = 'wen';
    scope.watch();
    expect(scope.mismatch).toBe(true);
    expect(scope.messages.passwordMismatch).toBe(true);
  });
  describe('on submit', function() {
    beforeEach(function() {
      scope.submit();
    });
    it('tries to authenticate', function() {
      expect(auth.login).toHaveBeenCalled();
    });
    describe('on auth success', function() {
      beforeEach(function() {
        auth.def.resolve();
        scope.$digest();
      });
      it('tries to update the user', function() {
        expect(api.users.update).toHaveBeenCalled();
      });
      describe('on change success', function() {
        beforeEach(function() {
          api.users.def.update.resolve();
          scope.$digest();
        });
        it('shows a confirmation message', function() {
          expect(scope.messages.success).toBeTruthy();
        });
        describe('after the timeout', function() {
          beforeEach(function(){
            $timeout.flush();
          });
          it('navigates back', function() {
            expect($window.history.back).toHaveBeenCalled();
          });
        });
      });
      describe('on change failure', function() {
        beforeEach(function(){
          api.users.def.update.reject(['shortPassword']);
          scope.$digest();
        });
        it('tells the user', function(){
          expect(scope.messages.shortPassword).toBeTruthy();
        });
        it('is not loading anymore', function() {
          expect(scope.loading).toBe(false);
        });
      });
    });
    describe('on auth failure', function() {
      beforeEach(function(){
        auth.def.reject(['authenticationFailure']);
        scope.$digest();
      });
      it('explains in a message and logs out after a timeout', function() {
        expect(scope.messages.authenticationFailure).toBeTruthy();
        $timeout.flush();
        scope.$digest();
        expect(auth.logout).toHaveBeenCalled();
      });
    });
  });
});
