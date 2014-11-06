'use strict';
/* jshint camelcase: false */

describe('Service: Monitors', function () {

  // load the service's module
  beforeEach(module('citizendeskFrontendApp'));

  // instantiate service
  var Monitors,
      deferreds = {},
      $q,
      $rootScope,
      api = {
        twt_streams: {
          query: function(){}
        },
        twt_filters: {
          query: function(){}
        }
      };
  beforeEach(module(function($provide) {
    $provide.value('api', api);
  }));
  beforeEach(inject(function(_$q_, _$rootScope_) {
    $q = _$q_;
    $rootScope = _$rootScope_;
    deferreds.twt_streams_query = $q.defer();
    spyOn(api.twt_streams, 'query')
      .and.returnValue(deferreds.twt_streams_query.promise);
    deferreds.twt_filters_query = $q.defer();
    spyOn(api.twt_filters, 'query')
      .and.returnValue(deferreds.twt_filters_query.promise);
  }));
  beforeEach(inject(function (_Monitors_) {
    Monitors = _Monitors_;
  }));

  it('asks for monitors', function() {
    expect(api.twt_streams.query).toHaveBeenCalled();
  });
  it('asks again when update is called', function() {
    Monitors.update();
    expect(api.twt_streams.query.calls.count()).toBe(2);
  });
  describe('got monitors from the server', function() {
    beforeEach(function() {
      deferreds.twt_streams_query.resolve({
        _items: [{
          _id: 'stream 1',
          user_id: {
            _id: '1'
          },
          spec: { filter_id: 'a' }
        }, {
          _id: 'stream 2',
          user_id: {
            _id: '2'
          },
          spec: { filter_id: 'b' }
        }]
      });
    });
    describe('got filters from the server', function() {
      beforeEach(function() {
        deferreds.twt_filters_query.resolve({
          _items: [{
            _id: 'a'
          }, {
            _id: 'b'
          }]
        });
      });
      it('can get by user id', function() {
        /* the monitors could not be there yet when this method is called,
         so it has to return a promise. at the same time, in this test we
         know that monitors are already there, it is just a matter of
         shaking the scopes a bit */
        var result;
        Monitors.getByUserId('1')
          .then(function(_result) {
            result = _result;
          });
        $rootScope.$digest();
        expect(result.user_id._id).toBe('1');
      });
      it('can get by monitor id', function() {
        var result;
        Monitors.getById('stream 2')
          .then(function(_result) {
            result = _result;
          });
        $rootScope.$digest();
        expect(result._id).toBe('stream 2');
      });
    });
  });
});
