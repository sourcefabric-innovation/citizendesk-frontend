'use strict';

describe('Service: TwitterSearches', function () {

  // load the service's module
  beforeEach(module('citizendeskFrontendApp'));

  // instantiate service
  var TwitterSearches,
      $q,
      $rootScope,
      $httpBackend,
      api,
      session = {
        identity: {
          _id: 'test user id'
        },
      };
  beforeEach(module(function($provide) {
    $provide.value('session', session);
    /* playing with `$http` triggers somehow `$locationChangeStart`,
    which triggers the authentication and an endless digest
    cycle. replacing the autenthication with this empty function */
    $provide.value('initAuth', function(){});
  }));
  beforeEach(inject(function(_$q_, _api_) {
    $q = _$q_;
    api = _api_;
    spyOn(api.twt_searches, 'query').andCallThrough();
    session.getIdentity = function() { return $q.when(); };
  }));
  beforeEach(inject(function (_TwitterSearches_, _$rootScope_, _$httpBackend_) {
    $rootScope = _$rootScope_;
    $httpBackend = _$httpBackend_;
    TwitterSearches = _TwitterSearches_;
  }));

  it('creates a new search', function () {
    spyOn(api.twt_searches, 'create').andCallThrough();
    TwitterSearches.create('a test query');
    expect(api.twt_searches.create).toHaveBeenCalled();
    expect(api.twt_searches.create.mostRecentCall.args[0].creator)
      .toBe('test user id');
  });
  describe('after downloading searches', function(){
    var queue;
    beforeEach(function(){
      TwitterSearches
        .byId('search id')
        .then(function(_queue_) {
          queue = _queue_;
        });
      api.twt_searches.def.query.resolve({
        _items: [{
          _id: 'search id'
        }]
      });
      $httpBackend
        .expectPOST(globals.root + 'proxy/start-twitter-search/')
        .respond();
      spyOn(api.reports, 'query').andCallThrough();
      spyOn(TwitterSearches, 'start').andCallThrough();
      $rootScope.$digest(); // return the searches
      $httpBackend.flush(); // respond start request
    });
    describe('and some specific reports', function(){
      beforeEach(function(){
        api.reports.def.query.resolve({
          _items: [{
            _id: 'to be refreshed'
          }],
          _links: {}
        });
        $rootScope.$digest(); // return the reports
      });
      it('got the queue', function(){
        expect(queue).toBeDefined();
      });
      it('started the queue', function(){
        expect(TwitterSearches.start).toHaveBeenCalled();
      });
      describe('refreshing a report', function(){
        var result;
        beforeEach(function(){
          spyOn(api.reports, 'getById')
            .andCallThrough();
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
            api.reports.def.getById.resolve({
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
