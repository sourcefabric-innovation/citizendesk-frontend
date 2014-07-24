'use strict';

describe('Service: DetailsFetcher', function () {

  // load the service's module
  beforeEach(module('citizendeskFrontendApp'));

  // instantiate service
  var detailsFetcher,
      deferred,
      endpoint = {},
      $rootScope;
  beforeEach(inject(function (_detailsFetcher_, _$rootScope_, $q) {
    deferred = $q.defer();
    endpoint.getById = function(){};
    spyOn(endpoint, 'getById').andReturn(deferred.promise);
    detailsFetcher = _detailsFetcher_;
    $rootScope = _$rootScope_;
  }));

  describe('when asked for details', function() {
    var details;
    beforeEach(function() {
      details = {};
      detailsFetcher('id', endpoint, details);
    });
    it('sends a request', function () {
      expect(endpoint.getById).toHaveBeenCalledWith('id');
    });
    it('sets a temporary value', function() {
      expect(details['id']).toBe(false);
    });
    describe('when it gets an answer', function() {
      beforeEach(function() {
        deferred.resolve('response');
        $rootScope.$digest();
      });
      it('saves the response', function() {
        expect(details['id']).toBe('response');
      });
    });
  });

});
