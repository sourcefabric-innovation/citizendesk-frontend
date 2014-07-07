'use strict';

/*
 A service allowing to register time interval handlers that will be
 reset on page change. The base use case is that of a page polling on
 some resources, where the polling has to be interrupted when the user
 navigates away.
 */

describe('Service: PagePolling', function () {

  // load the service's module
  beforeEach(module('citizendeskFrontendApp'));

  // instantiate service
  var PagePolling,
      $interval,
      $rootScope;
  beforeEach(inject(function (_PagePolling_, _$interval_, _$rootScope_) {
    PagePolling = _PagePolling_;
    $interval = _$interval_;
    $rootScope = _$rootScope_;
  }));

  describe('with a listener', function(){
    var counter;
    beforeEach(function() {
      counter = 0;
      PagePolling.setInterval(function() {
        counter += 1;
      }, 1000);
    });
    it('calls the handler after the interval elapses', function () {
      $interval.flush(2001);
      expect(counter).toBe(2);
    });
    describe('after the user navigated away', function() {
      beforeEach(function() {
        $rootScope.$broadcast('$routeChangeStart');
      });
      it('resets the promises', function() {
        expect(PagePolling.promises.length).toBe(0);
      });
      it('ignores the handler', function () {
        $interval.flush(2001);
        expect(counter).toBe(0);
      });
    });
  });

});
