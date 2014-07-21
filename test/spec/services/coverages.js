'use strict';

describe('Service: Coverages', function () {

  // load the service's module
  beforeEach(module('citizendeskFrontendApp'));

  // instantiate service
  var Coverages;
  beforeEach(module(function ($provide) {
    $provide.value('api', {
      coverages: {
        query: function() {
          return {
            then: function(f) {
              f(mocks.coverages.list);
            }
          };
        }
      }
    });
  }));
  beforeEach(inject(function (_Coverages_) {
    Coverages = _Coverages_;
  }));

  it('should keep the promise', inject(function ($rootScope) {
    var spy = jasmine.createSpy();
    Coverages.promise.then(spy);
    $rootScope.$digest();
    expect(spy).toHaveBeenCalled();
  }));

  it('should get coverages', inject(function ($rootScope) {
    var coverages;
    Coverages.promise.then(function(c) { coverages = c; });
    $rootScope.$digest();
    expect(coverages.length).toBe(2);
  }));

});
