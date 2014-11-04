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
  beforeEach(inject(function(_$q_, _api_, Raven) {
    $q = _$q_;
    api = _api_;
    spyOn(api.twt_searches, 'query').and.callThrough();
    session.getIdentity = function() { return $q.when(); };
    Raven.raven.captureMessage = jasmine.createSpy('Raven capture message');
  }));
  beforeEach(inject(function (_TwitterSearches_, _$rootScope_, _$httpBackend_) {
    $rootScope = _$rootScope_;
    $httpBackend = _$httpBackend_;
    TwitterSearches = _TwitterSearches_;
  }));

  it('creates a new search', function () {
    spyOn(api.twt_searches, 'create').and.callThrough();
    TwitterSearches.create('a test query');
    expect(api.twt_searches.create).toHaveBeenCalled();
    expect(api.twt_searches.create.calls.mostRecent().args[0].creator)
      .toBe('test user id');
    expect(TwitterSearches.list.length).toBe(0);
    api.twt_searches.def.create.resolve({});
    $rootScope.$digest();
    expect(TwitterSearches.list.length).toBe(1);
  });
  it('deletes a search', function() {
    TwitterSearches.list.push({i:'am',a:'search'});
    TwitterSearches.delete(TwitterSearches.list[0]);
    api.twt_searches.def.remove.resolve('everything is gonna be allright');
    $rootScope.$digest();
    expect(TwitterSearches.list.length).toBe(0);
  });
  it('calls Raven when a search id is not found', inject(function(Raven) {
    expect(Raven.raven.captureMessage).not.toHaveBeenCalled();
    TwitterSearches.byId('this cannot be found');
    api.twt_searches.def.query.resolve({
      _items: [{
        _id: 'this can be found'
      }]
    });
    $rootScope.$digest();
    expect(Raven.raven.captureMessage).toHaveBeenCalled();
  }));
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
      spyOn(api.reports, 'query').and.callThrough();
      spyOn(TwitterSearches, 'start').and.callThrough();
      $rootScope.$digest(); // return the searches
      $httpBackend.flush(); // respond start request
    });
    // the following test may look a bit funny because the code
    // performs two successive calls to the same `eve-api` method, so
    // we have to play with the Angular digest in order to avoid an
    // endless loop
    it('downloads its reports even on multiple pages', function() {
      // provide a resolution for the promise, but the resolution will
      // wait untill the next digest cycle
      api.reports.def.query.resolve({
        _items: [{}],
        _links: {
          next: 'whatever'
        }
      });
      // reset the promise, so that the next call will stop (avoid the
      // endless loop)
      api.reports.reset.query();
      // add the spy again, it was wiped out with the reset
      spyOn(api.reports, 'query').and.callThrough();
      // now that the new promise is ready, digest the previous
      // resolution. the code will find that `_links.next` is present
      // and ask for the second page
      $rootScope.$digest();
      // expect the next page to have been requested
      expect(api.reports.query).toHaveBeenCalled();
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
            .and.callThrough();
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
