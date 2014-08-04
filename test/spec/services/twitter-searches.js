'use strict';

describe('Service: TwitterSearches', function () {

  // load the service's module
  beforeEach(module('citizendeskFrontendApp'));

  // instantiate service
  var TwitterSearches,
      api = {
        twt_searches: {
          query: function(){}
        },
        reports: {
          query: function(){},
          getById: function(){}
        }
      },
      $q,
      $rootScope,
      $httpBackend,
      deferreds = {
        twt_searches: {},
        reports: {}
      };
  beforeEach(module(function($provide) {
    $provide.value('api', api);
  }));
  beforeEach(inject(function(_$q_) {
    $q = _$q_;
    deferreds.twt_searches.query = $q.defer();
    spyOn(api.twt_searches, 'query')
      .andReturn(deferreds.twt_searches.query.promise);
  }));
  beforeEach(inject(function (_TwitterSearches_, _$rootScope_, _$httpBackend_) {
    $rootScope = _$rootScope_;
    $httpBackend = _$httpBackend_;
    TwitterSearches = _TwitterSearches_;
  }));

  it('has a create method', function () {
    expect(TwitterSearches.create).toBeDefined();
  });
  describe('after downloading searches', function(){
    var queue;
    beforeEach(function(){
      TwitterSearches
        .byId('search id')
        .then(function(_queue_) {
          queue = _queue_;
        });
      deferreds.twt_searches.query.resolve({
        _items: [{
          _id: 'search id'
        }]
      });
      $rootScope.$digest();
    });
    describe('and some specific reports', function(){
      var started;
      beforeEach(function(){
        $httpBackend
          .expectPOST(globals.root + 'proxy/start-twitter-search/')
          .respond();
        deferreds.reports.query = $q.defer();
        spyOn(api.reports, 'query').andReturn(deferreds.reports.query.promise);
        TwitterSearches
          .start(queue)
          .then(function(_queue_) {
            started = true;
          });
        deferreds.reports.query.resolve({
          _items: [{
            _id: 'to be refreshed'
          }],
          _links: {}
        });
        $httpBackend.flush();
        $rootScope.$digest();
      });
      it('started the queue', function(){
        expect(started).toBe(true);
      });
      describe('refreshing a report', function(){
        var result;
        beforeEach(function(){
          deferreds.reports.getById = $q.defer();
          spyOn(api.reports, 'getById')
            .andReturn(deferreds.reports.getById.promise);
          TwitterSearches
            .refreshReport('search id', 'to be refreshed')
            .then(function(_result_) {
              result = _result_;
            });
          $rootScope.$digest();
        });
        it('asks for fresh data', function(){
          expect(api.reports.getById).toHaveBeenCalled();
        });
        describe('got the data', function(){
          beforeEach(function(){
            deferreds.reports.getById.resolve({
              _id: 'to be refreshed',
              refreshed: true
            });
            $rootScope.$digest();
          });
          it('found the right index', function(){
            expect(result.index).toBe(0);
          });
          it('got the right report', function(){
            expect(result.fresh.refreshed).toBe(true);
          });
          it('updated the queue correctly', function(){
            expect(queue.reports[0].refreshed).toBe(true);
          });
        });
      });
    });
  });
});
