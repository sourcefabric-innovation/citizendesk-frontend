'use strict';

/* this is a report session, do not confuse with an authentication session */

describe('Controller: SessionCtrl', function () {

  // load the controller's module
  beforeEach(module('citizendeskFrontendApp'));

  var SessionCtrl,
      scope,
      $httpBackend,
      detailsFetcher = jasmine.createSpy(),
      $location = {
        url: function(){}
      },
      Report = {
        create: function(){
          return {};
        }
      },
      reportStatuses,
      api;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _$httpBackend_, $q, _reportStatuses_, _api_) {
    $httpBackend = _$httpBackend_;
    api = _api_;
    reportStatuses = _reportStatuses_;

    spyOn($location, 'url');

    spyOn(api.reports, 'query').and.callThrough();
    api.reports.def.query.resolve(mocks.reports['list-not-paginated-session']);

    spyOn(api.users, 'query').and.callThrough();

    scope = $rootScope.$new();
    SessionCtrl = $controller('SessionCtrl', {
      $scope: scope,
      $routeParams: {
        session: 'test-session-id'
      },
      session: {
        identity: {
          user: 'test-user-id'
        }
      },
      now: function() {
        return 'now';
      },
      detailsFetcher: detailsFetcher,
      $location: $location,
      Report: Report
    });
    scope.$digest();
  }));

  it('gets the reports in the session', function() {
    expect(scope.reports.length).toBe(6);
  });
  it('finds the last report to use for reply', function() {
    /* my humble opinion is that it is silly and unsafe to have this
     logic on the client side, and that it should be possible to send
     replies using the session id instead of a report id */
    scope.$digest();
    expect(scope.replyReport._id).toBe('53bd65389c61672e3d00000c');
  });
  it('checks again on interval', function() {
    expect(api.reports.query.calls.count()).toBe(2);
    scope.onInterval();
    expect(api.reports.query.calls.count()).toBe(3);
  });
  it('checks users on a single page', function() {
    expect(function() {
      api.users.def.query.resolve({_items:[{
        _id: 1
      }, {
        _id: 2
      }], _links:{}});
      scope.$digest();
    }).not.toThrow();
  });
  it('checks users on multiple pages', function() {
    expect(function() {
      api.users.def.query.resolve({_items:[{
        _id: 1
      }, {
        _id: 2
      }], _links:{ next: 'whatever' }});
      // reset the promise otherwise the request for a new page will
      // lead to an infinite loop and your computer will heat
      api.users.reset.query();
      scope.$digest();
    }).not.toThrow();
  });
  describe('when a reply is sent', function() {
    beforeEach(inject(function($q) {
      $httpBackend
        .expectPOST(globals.root + 'proxy/mobile-reply/', {
          "report_id":"53bd65389c61672e3d00000c",
          "message":"Please, tell us where you are!",
          "sensitive":false,
          "language":"en"
        })
        .respond(200);
      var reports = angular
            .copy(mocks.reports['list-not-paginated-session']);
      reports._items.push({id_:'new report'});

      api.reports.reset.query();
      api.reports.def.query.resolve(reports);

      scope.reply = 'Please, tell us where you are!';
      scope.sendReply();
      $httpBackend.flush();
      scope.$digest();
    }));
    it('adds the sent report to the session', function() {
      expect(scope.reports.length).toBe(7);
    });
    it('sends a message reply', function () {
      $httpBackend.verifyNoOutstandingRequest();
      $httpBackend.verifyNoOutstandingExpectation();
    });
    it('empties the text area', function() {
      expect(scope.reply).toBe('');
    });
  });

  it('fetches the reports twice, once for reports and once for summaries', function() {
    expect(api.reports.query.calls.count()).toBe(2);
  });
  it('fetches the summaries after the reports', function(){
    expect(api.reports.query.calls.mostRecent().args)
      .toEqual([ { where : '{"$and":[{"session":"test-session-id"},{"summary":true}]}', sort : '[("produced", 1)]', page : 1 } ]);
  });

  describe('creating a summary', function() {
    beforeEach(function() {
      scope.summaryContent = 'summary content';

      spyOn(api.reports, 'save').and.callThrough();
    });
    it('saves a report and queries for summaries', function() {
      scope.submitSummary();
      expect(api.reports.save).toHaveBeenCalled();
      expect(api.reports.save.calls.mostRecent().args[0].texts)
        .toEqual([ { original : 'summary content' } ]);
      expect(api.reports.save.calls.mostRecent().args[0].status)
        .toEqual(reportStatuses('verified'));
      api.reports.def.save.resolve('whatever');
      scope.$digest();
      expect(api.reports.query).toHaveBeenCalled();
    });
  });
  it('redirects the user to the summary details', function(){
    scope.goToSummary();
    expect($location.url)
      .toHaveBeenCalledWith('/report-sms/53bbec329c61672e3d000007' );
  });
  it('can handle also several reports pages', inject(function($rootScope, $controller, $q) {
    var first = true;
    api.reports.reset.query();
    // all this machinery is in order to have a the first promise
    // resolved, and the second blocked
    spyOn(api.reports, 'query').and.callFake(function() {
      if (first) {
        first = false;
        return $q.when(mocks.reports.list);
      } else {
        return $q.defer().promise;
      }
    });
    scope = $rootScope.$new();
    SessionCtrl = $controller('SessionCtrl', {
      $scope: scope,
      $routeParams: {
        session: 'test-session-id'
      },
      session: {
        identity: {
          user: 'test-user-id'
        }
      },
      now: function() {
        return 'now';
      },
      detailsFetcher: detailsFetcher,
      $location: $location,
      Report: Report
    });
    scope.$digest();
    expect(api.reports.query.calls.count()).toBe(3);
  }));
});
