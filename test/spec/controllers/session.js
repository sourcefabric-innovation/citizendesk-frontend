'use strict';

/* this is a report session, do not confuse with an authentication session */

describe('Controller: SessionCtrl', function () {

  // load the controller's module
  beforeEach(module('citizendeskFrontendApp'));

  var SessionCtrl,
      scope,
      $httpBackend,
      detailsFetcher = jasmine.createSpy(),
      api = {
        reports: {},
        users: {}
      },
      reportsQueryDeferred,
      usersQueryDeferred;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _$httpBackend_, $q) {
    $httpBackend = _$httpBackend_;
    scope = $rootScope.$new();

    api.reports.query = function(){};
    reportsQueryDeferred = $q.defer();
    spyOn(api.reports, 'query').andReturn(reportsQueryDeferred.promise);
    reportsQueryDeferred.resolve(mocks.reports['list-not-paginated-session']);

    api.users.query = function(){};
    usersQueryDeferred = $q.defer();
    spyOn(api.users, 'query').andReturn(usersQueryDeferred.promise);
    usersQueryDeferred.resolve({_items:[], _links:{}});

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
      api: api
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

  describe('when a reply is sent', function() {
    beforeEach(inject(function($q) {
      $httpBackend
        .expectPOST(globals.root + 'proxy/mobile-reply/', {
          "report_id":"test-report-id"
          ,"message":"Please, tell us where you are!"
          ,"sensitive":false
          ,"language":"en"
        })
        .respond(200);
      var reports = angular
            .copy(mocks.reports['list-not-paginated-session']);
      reports._items.push({id_:'new report'});

      api.reports.query = function(){};
      reportsQueryDeferred = $q.defer();
      spyOn(api.reports, 'query').andReturn(reportsQueryDeferred.promise);
      reportsQueryDeferred.resolve(reports);

      scope.sendReply({
        report_id: 'test-report-id',
        message: 'Please, tell us where you are!'
      });
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
  });
});
