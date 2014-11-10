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
      $timeout,
      Raven,
      api,
      PageBroker;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _$q_, _Raven_, _api_, _PageBroker_) {
    $q = _$q_;
    api = _api_;

    deferreds.Monitors_getByUserId = $q.defer();
    spyOn(Monitors, 'getByUserId')
      .and.returnValue(deferreds.Monitors_getByUserId.promise);

    spyOn(api.twt_oauths, 'query').and.callThrough();

    spyOn(PagePolling, 'setInterval');
    $timeout = jasmine.createSpy('timeout');
    $timeout.cancel = function(){};

    PageBroker = _PageBroker_;
    spyOn(PageBroker, 'load');
    
    scope = $rootScope.$new();
    MyMonitorCtrl = $controller('MyMonitorCtrl', {
      $scope: scope,
      $http: $http,
      Monitors: Monitors,
      session: {
        identity: {
          _id: 'test user id'
        }
      },
      PagePolling: PagePolling,
      QueueSelection: QueueSelection,
      $timeout: $timeout,
      PageBroker: PageBroker
    });
    Raven = _Raven_;
    spyOn(Raven.raven, 'captureMessage');
  }));

  it('assigns', function() {
    scope.assign('a fake report');
    expect(PageBroker.load).toHaveBeenCalled();
  });
  it('tells us when weird things happen', function() {
    scope.missing.key = true;
    scope.missing.monitor = false;
    scope.missingChange();
    expect(Raven.raven.captureMessage).toHaveBeenCalled();
  });
  it('asks for the monitor belonging to this user', function() {
    expect(Monitors.getByUserId).toHaveBeenCalledWith('test user id');
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
        api.twt_oauths.def.query.resolve({_items:[]});
        scope.$digest();
      });
      it('shows a link to the key creation', function() {
        expect(scope.showKeyPointer).toBe(true);
      });
    });
    describe('if the user has a key already', function() {
      beforeEach(function(){
        api.twt_oauths.def.query.resolve({_items:[{
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

          spyOn(api.twt_filters, 'save').and.callThrough();
          spyOn(api.twt_streams, 'save').and.callThrough();
          spyOn(api.reports, 'query').and.callThrough();
          deferreds.$http_get = $q.defer();
          spyOn($http, 'get')
            .and.returnValue(deferreds.$http_get.promise);

          scope.search = ['search terms'];
          scope.create();
          api.twt_filters.def.save.resolve({
            _id: 'filter id',
            spec: { track: ['search terms'] }
          });
          scope.$digest();
        });
        it('asked to create the filter', function() {
          expect(api.twt_filters.save.calls.mostRecent().args)
            .toEqual([ { spec : { track : ['search terms'] } } ]);
        });
        it('creates the monitor', function(){
          expect(api.twt_streams.save).toHaveBeenCalled();
        });
        describe('the monitor is created', function() {
          beforeEach(function() {
            api.twt_streams.def.save.resolve({
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
              $timeout.calls.mostRecent().args[0]();
              expect(scope.tellToWait).toBeFalsy();
            });
            it('asks for reports', function() {
              expect(api.reports.query).toHaveBeenCalled();
            });
            describe('first reports are received', function() {
              beforeEach(function() {
                api.reports.def.query.resolve({_items:[{}]});
                scope.$digest();
              });
              it('adds the reports to the scope', function() {
                expect(scope.reports).toEqual([{}]);
              });
              it('starts polling for reports', function() {
                expect(PagePolling.setInterval).toHaveBeenCalled();
              });
              describe('after the interval', function() {
                beforeEach(function(){
                  PagePolling.setInterval.calls.argsFor(0)[0]();
                });
                it('fetches new reports after the interval', function(){
                  expect(scope.updating).toBe(true);
                  // that promise has already been resolved for the
                  // first request, but the resolution will stay
                  // blocked until we digest the changes
                  scope.$digest();
                  expect(scope.updating).toBe(false);
                  expect(scope.reports.length).toBe(1);
                  expect(scope.newReports.length).toBe(1);
                  scope.showNew();
                  // duplicates are removed
                  expect(scope.reports.length).toBe(1);
                  expect(scope.newReports.length).toBe(0);
                });
              });
            });
          });
        });
      });
    });
  });
  describe('after the monitor is received', function() {
    beforeEach(function() {
      spyOn(api.reports, 'query').and.callThrough();

      deferreds.Monitors_getByUserId.resolve(monitor);
      scope.$digest();
    });
    it('has a monitor in the scope', function() {
      expect(scope.monitor).toBeDefined();
    });
    it('asks for reports', function() {
      expect(api.reports.query).toHaveBeenCalled();
    });
    it('looks for more reports when we ask so, not duplicating', function() {
      expect(api.reports.query.calls.count()).toBe(1);
      scope.moreReports();
      expect(api.reports.query.calls.count()).toBe(2);
      api.reports.def.query.resolve({
        _items: [{_id: 1}, {_id: 2}]
      });
      scope.$digest();
      expect(scope.reports.length).toBe(2);
    });
    it('does not show the wait message', function() {
      expect($timeout).not.toHaveBeenCalled();
    });
    describe('first reports are received', function() {
      beforeEach(function() {
        api.reports.def.query
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
      it('cancels editing', function() {
        expect(scope.editing).toBe(true);
        scope.cancelEdit();
        expect(scope.editing).toBe(false);
      });
      describe('and she saves', function() {
        beforeEach(function() {
          spyOn(api.twt_filters, 'save').and.callThrough();
          scope.save();
        });
        it('updates the filter', function() {
          expect(api.twt_filters.save).toHaveBeenCalled();
        });
        describe('after the filter is updated', function() {
          beforeEach(function() {
            var response = angular
                  .copy(api.twt_filters.save.calls.mostRecent().args[0]);
            response._etag = 'new etag';
            api.twt_filters.def.save.resolve(response);
            deferreds.get = $q.defer();
            spyOn(Monitors, 'update');
            spyOn($http, 'get').and.returnValue(deferreds.get.promise);
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
              deferreds.get = $q.defer();
              stopDeferred.resolve();
              scope.$digest();
              expect($http.get.calls.mostRecent().args[0]).toBe(start);
              deferreds.get.resolve();
            });
            it('comes back to the starting status', function() {
              expect(scope.disabled).toBe(false);
              expect(scope.editing).toBe(false);
            });
            it('shows an explanation and hides it after a while', function() {
              expect(scope.tellToWait).toBeTruthy();
              expect($timeout).toHaveBeenCalled();
              $timeout.calls.mostRecent().args[0]();
              expect(scope.tellToWait).toBeFalsy();
            });
          });
        });
      });
    });
  });
});
