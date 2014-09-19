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
        reports: {
          query: function(params){
            var where = JSON.parse(params.where);
            if (where.$and[1].summary) {
              return def.reports_summaries.query.promise;
            } else {
              return def.reports.query.promise;
            }
          },
          save: function(){}
        },
        users: {
          query: function(){}
        }
      },
      def = {
        reports: {},
        reports_summaries: {},
        users: {}
      },
      $location = {
        url: function(){}
      },
      Report = {
        create: function(){
          return {};
        }
      };

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _$httpBackend_, $q) {
    $httpBackend = _$httpBackend_;
    scope = $rootScope.$new();

    spyOn($location, 'url');

    spyOn(api.reports, 'query').andCallThrough();

    def.reports.query = $q.defer();
    def.reports.query.resolve(mocks.reports['list-not-paginated-session']);

    def.reports_summaries.query = $q.defer();

    def.users.query = $q.defer();
    spyOn(api.users, 'query').andReturn(def.users.query.promise);
    def.users.query.resolve({_items:[], _links:{}});

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
      api: api,
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

  describe('when a reply is sent', function() {
    beforeEach(inject(function($q) {
      $httpBackend
        .expectPOST(globals.root + 'proxy/mobile-reply/', {
          "report_id":"test-report-id",
          "message":"Please, tell us where you are!",
          "sensitive":false,
          "language":"en"
        })
        .respond(200);
      var reports = angular
            .copy(mocks.reports['list-not-paginated-session']);
      reports._items.push({id_:'new report'});

      def.reports.query.promise = $q.when(reports);

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

  it('fetches the reports twice, once for reports and once for summaries', function() {
    expect(api.reports.query.calls.length).toBe(2);
  });
  it('fetches the summaries after the reports', function(){
    expect(api.reports.query.mostRecentCall.args)
      .toEqual([ { where : '{"$and":[{"session":"test-session-id"},{"summary":true}]}', sort : '[("produced", 1)]', page : 1 } ]);
  });

  describe('creating a summary', function() {
    beforeEach(inject(function($q) {
      scope.summaryContent = 'summary content';

      def.reports.save = $q.defer();
      spyOn(api.reports, 'save').andReturn(def.reports.save.promise);

      def.reports.query = $q.defer();
    }));
    it('saves a report and queries for summaries', function() {
      scope.submitSummary();
      expect(api.reports.save).toHaveBeenCalled();
      expect(api.reports.save.mostRecentCall.args[0].texts)
        .toEqual([ { original : 'summary content' } ]);
      def.reports.save.resolve('whatever');
      scope.$digest();
      expect(api.reports.query).toHaveBeenCalled();
    });
  });
  describe('when a summary is already available', function(){
    beforeEach(function(){
      def.reports_summaries.query
        .resolve({
          _items: [{
            _id: 'summary report'
          }],
          _links: {}
        });
      scope.$digest();
    });
    it('can redirect the user to the summary details', function(){
      scope.goToSummary();
      expect($location.url)
        .toHaveBeenCalledWith('/report-sms/summary report' );
    });
  });
});
