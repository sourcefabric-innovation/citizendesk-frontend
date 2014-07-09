'use strict';

/* the purpose of this controller is allowing a page to pass some data
to the next page, something that would not fit into the route
parameters */

describe('Service: PageBroker', function () {

  // load the service's module
  beforeEach(module('citizendeskFrontendApp'));

  var $location = {
    url: jasmine.createSpy()
  };
  // mock dependencies
  beforeEach(module(function($provide) {
    $provide.value('$location', $location);
  }));

  // instantiate service
  var PageBroker,
      $rootScope;
  beforeEach(inject(function (_PageBroker_, _$rootScope_) {
    PageBroker = _PageBroker_;
    $rootScope = _$rootScope_;
  }));

  describe('after a page is requested for loading', function() {
    beforeEach(function() {
      PageBroker.load('/new-route/', {
        data: 'data content'
      });
    });
    it('has data', function() {
      var res;
      PageBroker
        .getData('/fallback-route/')
        .then(function(_res_) {
          res = _res_;
        });
      $rootScope.$digest();
      expect(res.data).toBe('data content');
    });
    describe('after a location change', function() {
      beforeEach(function() {
        $location.url = function() {
          return '/different-route/';
        };
        spyOn($location, 'url').andCallThrough();
        $rootScope.$broadcast('$locationChangeSuccess');
      });
      /* if a page relies on data being in the page broker, this may
       lead to an error when the user jumps to the page directly, for
       example from the location. in this case the page broker does not
       resolve the promise, but instead it redirects the user to the
       fallback page */
      it('has no data anymore', function() {
        var res;
        PageBroker
          .getData('/fallback-route/')
          .then(function(_res_) {
            res = _res_;
          });
        expect($location.url).toHaveBeenCalledWith('/fallback-route/');
      });
    });
    /* the page broker can keep its data just for one location change,
    and precisely the change that it is supposed to trigger */
    describe('after the expected location change', function() {
      beforeEach(function() {
        $location.url = function() {
          return '/new-route/';
        };
        spyOn($location, 'url').andCallThrough();
        $rootScope.$broadcast('$locationChangeSuccess');
      });
      it('has data', function() {
        var res;
        PageBroker
          .getData('/fallback-route/')
          .then(function(_res_) {
            res = _res_;
          });
        $rootScope.$digest();
        expect(res.data).toBe('data content');
      });
    });
  });
});
