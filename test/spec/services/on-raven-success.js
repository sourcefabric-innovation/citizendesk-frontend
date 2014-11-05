'use strict';

// there is not really a general way to fix a global error. errors
// should be handled before all this logic is involved, this is just a
// way to minimise confusion for users. when we have a global error we
// generally want the user to reload the application. this may happen
// simply because somebody else was editing the same entity, and the
// user has an outdated copy. in other cases the error may keep
// happening again and again, and we do not want the user to be
// trapped in a reloading loop

describe('Service: onRavenSuccess', function () {

  // load the service's module
  beforeEach(module('citizendeskFrontendApp'));

  // instantiate service
  var onRavenSuccess,
      $cookieStore = {},
      $window;
  beforeEach(module(function ($provide) {
    $provide.value('$cookieStore', $cookieStore);
  }));
  beforeEach(inject(function (_onRavenSuccess_, _$window_) {
    onRavenSuccess = _onRavenSuccess_;
    $window = _$window_;
  }));

  describe('the first time', function() {
    beforeEach(function() {
      var cookies = {};
      $cookieStore.put = function(key, value) {
        cookies[key] = value;
      };
      $cookieStore.get = function(key) {
        return cookies[key];
      };
      $cookieStore.remove = jasmine.createSpy('cookie store remove');
      spyOn($cookieStore, 'put').and.callThrough();
      spyOn($window.location, 'reload');
      onRavenSuccess();
    });
    it('reloads', function () {
      expect($window.location.reload.calls.count()).toBe(1);
    });
    it('does nothing on location change success', function(){
      onRavenSuccess.onLocationChangeSuccess();
      expect($cookieStore.remove).not.toHaveBeenCalled();
    });
    describe('the second time', function() {
      beforeEach(function(){
        onRavenSuccess();
      });
      it('does not reload', function () {
        expect($window.location.reload.calls.count()).toBe(1);
      });
      describe('after the user navigates away', function() {
        beforeEach(function(){
          onRavenSuccess.onLocationChangeSuccess();
        });
        it('resets the reload counter', function() {
          expect($cookieStore.remove).toHaveBeenCalled();
        });
      });
    });
  });
});
