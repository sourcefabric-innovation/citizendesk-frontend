'use strict';

/* there is some confusion about terminology. it was decided to call
this entity "monitor", and this is reflected in the URL which is
visible to the user. On the other end, these entities are called
"streams" on the backend that the citizendesk core component uses */

describe('Controller: MyMonitorCtrl', function () {

  // load the controller's module
  beforeEach(module('citizendeskFrontendApp'));

  var MyMonitorCtrl,
      scope,
      $http = {
        get: function(){}
      },
      api = {
        twt_streams: {
          query: function(){},
          save: function(){}
        },
        twt_filters: {
          save: function(){}
        },
        twt_oauths: {
          query: function(){}
        },
        reports: {
          query: function(){}
        }
      },
      deferreds = {},
      Monitors = {
        getByUserId: function(){},
        update: function(){}
      },
      monitor = {
        _id: 'monitor id',
        filter: {
          spec: {
            track: []
          }
        }
      },
      $q,
      PagePolling = {
        setInterval: function(){}
      },
      QueueSelection = {},
      $timeout;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _$q_) {
    $q = _$q_;

    deferreds.Monitors_getByUserId = $q.defer();
    spyOn(Monitors, 'getByUserId')
      .andReturn(deferreds.Monitors_getByUserId.promise);

    deferreds.twt_oauths_query = $q.defer();
    spyOn(api.twt_oauths, 'query')
      .andReturn(deferreds.twt_oauths_query.promise);

    spyOn(PagePolling, 'setInterval');
    $timeout = jasmine.createSpy('timeout');
    $timeout.cancel = function(){};

    scope = $rootScope.$new();
    MyMonitorCtrl = $controller('MyMonitorCtrl', {
      $scope: scope,
      api: api,
      $http: $http,
      Monitors: Monitors,
      session: {
        identity: {
          _id: 'test user id'
        }
      },
      PagePolling: PagePolling,
      QueueSelection: QueueSelection,
      $timeout: $timeout
    });
  }));

  it('asks for the monitor belonging to this user', function() {
    expect(Monitors.getByUserId).toHaveBeenCalledWith("test user id");
  });
  it('asks for keys belonging to this user', function() {
    expect(api.twt_oauths.query).toHaveBeenCalled();
  });
  describe('if there is no monitor', function() {
    beforeEach(function() {
      deferreds.Monitors_getByUserId.resolve(null);
      scope.$digest();
    });
    describe('if there are no keys', function() {
      beforeEach(function(){
        deferreds.twt_oauths_query.resolve({_items:[]});
        scope.$digest();
      });
      it('shows a link to the key creation', function() {
        expect(scope.showKeyPointer).toBe(true);
      });
    });
    describe('if the user has a key already', function() {
      beforeEach(function(){
        deferreds.twt_oauths_query.resolve({_items:[{
          _id: 'key id'
        }]});
        scope.$digest();
      });
      it('adds the key to the scope', function(){
        expect(scope.key).toBeDefined();
      });
      it('shows the monitor create section', function() {
        expect(scope.showCreate).toBe(true);
      });
      describe('when the user enters search terms', function() {
        beforeEach(function() {

          deferreds.twt_filters_save = $q.defer();
          spyOn(api.twt_filters, 'save')
            .andReturn(deferreds.twt_filters_save.promise);
          deferreds.twt_streams_save = $q.defer();
          spyOn(api.twt_streams, 'save')
            .andReturn(deferreds.twt_streams_save.promise);
          deferreds.reports_query = $q.defer();
          spyOn(api.reports, 'query')
            .andReturn(deferreds.reports_query.promise);
          deferreds.$http_get = $q.defer();
          spyOn($http, 'get')
            .andReturn(deferreds.$http_get.promise);

          scope.search = ['search terms'];
          scope.create();
          deferreds.twt_filters_save.resolve({
            _id: 'filter id',
            spec: { track: ['search terms'] }
          });
          scope.$digest();
        });
        it('asked to create the filter', function() {
          expect(api.twt_filters.save.mostRecentCall.args)
            .toEqual([ { spec : { track : ['search terms'] } } ]);
        });
        it('creates the monitor', function(){
          expect(api.twt_streams.save).toHaveBeenCalled();
        });
        describe('the monitor is created', function() {
          beforeEach(function() {
            deferreds.twt_streams_save.resolve({
              _id: 'new monitor id'
            });
            scope.$digest();
          });
          it('the monitor is attached to the scope', function() {
            expect(scope.monitor).toBeDefined();
            expect(scope.monitor._id).toBe('new monitor id');
          });
          it('deletes the missing monitor property', function() {
            expect(scope.missing.monitor).toBeFalsy();
          });
          it('hides the create section', function() {
            expect(scope.showCreate).toBeFalsy();
          });
          it('starts the monitor', function(){
            expect($http.get).toHaveBeenCalled();
          });
          it('updates description accordingly', function(){
            expect(QueueSelection.description).toBe('search terms');
          });
          describe('monitor started', function() {
            beforeEach(function(){
              deferreds.$http_get.resolve();
              scope.$digest();
            });
            it('shows an explanation and hides it after a while', function() {
              expect(scope.tellToWait).toBeTruthy();
              expect($timeout).toHaveBeenCalled();
              $timeout.mostRecentCall.args[0]();
              expect(scope.tellToWait).toBeFalsy();
            });
            it('asks for reports', function() {
              expect(api.reports.query).toHaveBeenCalled();
            });
            describe('first reports are received', function() {
              beforeEach(function() {
                deferreds.reports_query.resolve({_items:[{}]});
                scope.$digest();
              });
              it('adds the reports to the scope', function() {
                expect(scope.reports).toEqual([{}]);
              });
              it('starts polling for reports', function() {
                expect(PagePolling.setInterval).toHaveBeenCalled();
              });
            });
          });
        });
      });
    });
  });
  describe('after the monitor is received', function() {
    beforeEach(function() {
      deferreds.reports_query = $q.defer();
      spyOn(api.reports, 'query').andReturn(deferreds.reports_query.promise);

      deferreds.Monitors_getByUserId.resolve(monitor);
      scope.$digest();
    });
    it('has a monitor in the scope', function() {
      expect(scope.monitor).toBeDefined();
    });
    it('asks for reports', function() {
      expect(api.reports.query).toHaveBeenCalled();
    });
    it('does not show the wait message', function() {
      expect($timeout).not.toHaveBeenCalled();
    });
    describe('first reports are received', function() {
      beforeEach(function() {
        deferreds.reports_query
          .resolve(angular.copy(mocks.reports['list-not-paginated']));
        scope.$digest();
      });
      it('adds the reports to the scope', function(){
        expect(scope.reports.length).toBe(1);
      });
      it('adds the linked text to the reports', function(){
        expect(scope.reports[0].linkedText).toBeDefined();
      });
      it('starts polling for reports', function() {
        expect(PagePolling.setInterval).toHaveBeenCalled();
      });
    });
    describe('after the user edits', function() {
      var newSearch = ['changed', 'terms'];
      beforeEach(function() {
        scope.edit();
        scope.search = newSearch;
      });
      describe('and she saves', function() {
        beforeEach(function() {
          deferreds.save = $q.defer();
          spyOn(api.twt_filters, 'save').andReturn(deferreds.save.promise);
          scope.save();
        });
        it('updates the filter', function() {
          expect(api.twt_filters.save).toHaveBeenCalled();
        });
        describe('after the filter is updated', function() {
          beforeEach(function() {
            var response = angular
                  .copy(api.twt_filters.save.mostRecentCall.args[0]);
            response._etag = 'new etag';
            deferreds.save.resolve(response);
            deferreds.get = $q.defer();
            spyOn(Monitors, 'update');
            spyOn($http, 'get').andReturn(deferreds.get.promise);
            scope.$digest();
          });
          it('updates the filter in the scope', function(){
            expect(scope.monitor.filter.spec.track).toEqual(newSearch);
            expect(scope.monitor.filter._etag).toEqual('new etag');
          });
          it('updates the description', function(){
            expect(QueueSelection.description).toBe('changed, terms');
          });
          it('restarts the monitor', function() {
            var stop = globals.root+'/proxy/stop-stream/monitor id';
            expect($http.get).toHaveBeenCalledWith(stop);
          });
          describe('after the monitor is restarted', function() {
            beforeEach(function(){
              var start = globals.root+'/proxy/start-stream/monitor id';
              var stopDeferred = deferreds.get;
              deferreds.get = $q.defer()
              stopDeferred.resolve();
              scope.$digest();
              expect($http.get.mostRecentCall.args[0]).toBe(start);
              deferreds.get.resolve();
            });
            it('comes back to the starting status', function() {
              expect(scope.disabled).toBe(false);
              expect(scope.editing).toBe(false);
            });
            it('shows an explanation and hides it after a while', function() {
              expect(scope.tellToWait).toBeTruthy();
              expect($timeout).toHaveBeenCalled();
              $timeout.mostRecentCall.args[0]();
              expect(scope.tellToWait).toBeFalsy();
            });
          });
        });
      });
    });
  });
});
