'use strict';

describe('Service: ProcessedQueues', function () {

  // load the service's module
  beforeEach(module('citizendeskFrontendApp'));

  // instantiate service
  var ProcessedQueues,
      api,
      results = {},
      $rootScope;
  beforeEach(inject(function (_ProcessedQueues_, _api_, _$rootScope_) {
    api = _api_;
    ProcessedQueues = _ProcessedQueues_;
    $rootScope = _$rootScope_;

    spyOn(api.reports, 'query').and.callThrough();
    ProcessedQueues.requests.push('assigned');
    ProcessedQueues.requests.push('dismissed');
    ProcessedQueues
      .getResponses('assigned')
      .onValue(function(value) {
        results.assigned = value;
      });
    ProcessedQueues
      .getResponses('dismissed')
      .onValue(function(value) {
        results.dismissed = value;
      });
  }));

  it('fetches the different types of reports', function () {
    expect(api.reports.query).toHaveBeenCalled();
    expect(api.reports.query.calls.count()).toBe(2);
  });
  describe('upon the first burst of responses', function() {
    beforeEach(function() {
      // here we reply with a single response, but actually they will
      // be different requests and different responses
      api.reports.def.query.resolve({
        _items: [{}, {}, {}],
        _meta: {
          total: 3
        }
      });
      $rootScope.$digest();
    });
    it('saves the total counts', function() {
      expect(results.assigned._meta.total).toBe(3);
      expect(results.dismissed._meta.total).toBe(3);
    });
    describe('upon a second request and burst of responses', function() {
      beforeEach(function() {
        api.reports.reset.query();
        spyOn(api.reports, 'query').and.callThrough();
        ProcessedQueues.requests.push('assigned');
        ProcessedQueues.requests.push('dismissed');
        // here we reply with a single response, but actually they will
        // be different requests and different responses
        api.reports.def.query.resolve({
          _items: [{}, {}, {}, {}],
          _meta: {
            total: 4
          }
        });
        $rootScope.$digest();
      });
      it('fetches again', function () {
        expect(api.reports.query.calls.count()).toBe(2);
      });
      it('updates the total counts', function() {
        expect(results.assigned._meta.total).toBe(4);
        expect(results.dismissed._meta.total).toBe(4);
      });
    });
  });
});
