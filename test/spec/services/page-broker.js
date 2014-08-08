'use strict';

/* the purpose of this controller is allowing a page to pass some data
to the next page, something that would not fit into the route
parameters */

describe('Service: PageBroker', function () {

  // load the service's module
  beforeEach(module('citizendeskFrontendApp'));

  var $location = {
    url: function(){},
    path: function(){
      return { search: function(){ return { replace: function(){} }; } };
    }
  };
  var $window = {
    history: {
      back: function(){}
    }
  };
  // mock dependencies
  beforeEach(module(function($provide) {
    $provide.value('$location', $location);
    $provide.value('$window', $window);
  }));

  // instantiate service
  var PageBroker,
      $rootScope;
  beforeEach(inject(function (_PageBroker_, _$rootScope_) {
    PageBroker = _PageBroker_;
    $rootScope = _$rootScope_;
    spyOn($location, 'url');
    spyOn($window.history, 'back');
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
    /* the page broker can keep its data just for one location change */
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
      describe('after a second location change', function() {
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
    });
  });
  /* this is a different usage of the page broker: go back to a page
  transmitting some data. in this case we cannot simply use the
  `$route` service and navigate, we want to go back in the navigation
  history. for example, in order to keep the scrolling position in a
  long list. in this case we do not need a route fallback */
  describe('when used for a back action', function() {
    beforeEach(function(){
      PageBroker.back({ data: 'data' });
    });
    it('goes back in navigation', function(){
      expect($window.history.back).toHaveBeenCalled();
    });
    it('offers data without the need for a fallback', function(){
      expect(PageBroker.getReturnedData()).toEqual({ data:'data' });
    });
    it('keeps data after a single page change', function(){
      $rootScope.$broadcast('$locationChangeSuccess');
      expect(PageBroker.getReturnedData()).toEqual({ data:'data' });
    });
    it('deletes data after a double page change', function(){
      $rootScope.$broadcast('$locationChangeSuccess');
      $rootScope.$broadcast('$locationChangeSuccess');
      expect(PageBroker.getReturnedData()).toBeNull();
    });
  });
});
