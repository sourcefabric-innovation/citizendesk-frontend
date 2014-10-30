'use strict';
/*

 This factory provides an object to help fetching new items that match
 a given query. For example we want to fetch new tweets in the
 database as they are created.

 The object just remembers the last creation date, and it uses it for
 the next request in order to fetch just items created later.

 I cannot guarantee at the moment that no duplicates are returned
 after subsequent calls, so i advice to use something like the
 `addNewValues` service when merging new results with the existing
 ones.

 */

describe('Service: dateFetcherFactory', function () {

  // load the service's module
  beforeEach(module('citizendeskFrontendApp'));

  // instantiate service
  var dateFetcherFactory,
      endpoint = {
        query: function() {}
      },
      deferreds = {},
      $q,
      $rootScope;

  beforeEach(inject(function (_dateFetcherFactory_, _$q_, _$rootScope_) {
    dateFetcherFactory = _dateFetcherFactory_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    deferreds.query = $q.defer();
    spyOn(endpoint, 'query').andReturn(deferreds.query.promise);
  }));

  it('should do something', function () {
    expect(!!dateFetcherFactory).toBe(true);
  });
  it('can be initialised on an empty array', function(){
    var dateFetcher = dateFetcherFactory({
      initialise: [],
      property: 'whatever',
      endpoint: endpoint
    });
    var promise = dateFetcher.queryWhere({condition:'value'});
    expect(endpoint.query.mostRecentCall.args[0].where)
      .toBe('{"$and":[{"condition":"value"},{}]}');
  });
  it('passes the response through when it receives it', function() {
    var dateFetcher = dateFetcherFactory({
      initialise: [],
      property: 'whatever',
      endpoint: endpoint
    });
    var response = { _items:[] };
    expect(dateFetcher.onResponse(response)).toEqual(response);
  });

  describe('a queried dateFetcher', function() {
    var dateFetcher, promise;
    beforeEach(function() {
      dateFetcher = dateFetcherFactory({
        initialise: angular.copy([{
          modified: '2014-07-30T14:40:01+0000'
        },{
          modified: '2014-07-28T14:38:16+0000'
        },{
          modified: '2014-07-29T14:38:16+0000'
        }]),
        property: 'modified',
        endpoint: endpoint
      });
      promise = dateFetcher.queryWhere({condition:'value'});
    });
    it('queries with the right date', function() {
      expect(endpoint.query.mostRecentCall.args[0].where)
        .toBe('{"$and":[{"condition":"value"},{"modified":{"$gt":"2014-07-30T14:40:01+0000"}}]}');
    });
    describe('queried after the response', function() {
      beforeEach(function() {
        deferreds.query.resolve({
          _items: {
            modified: '2014-07-31T14:44:49+0000'
          }
        });
        $rootScope.$digest();
        dateFetcher.queryWhere({condition:'value'});
      });
      it('queries with an updated date', function() {
        expect(endpoint.query.mostRecentCall.args[0].where)
          .toBe('{"$and":[{"condition":"value"},{"modified":{"$gt":"2014-07-30T14:40:01+0000"}}]}');
      });
    });
  });
});

