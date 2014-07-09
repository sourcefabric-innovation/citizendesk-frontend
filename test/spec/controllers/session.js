'use strict';

/* this is a report session, do not confuse with an authentication session */

describe('Controller: SessionCtrl', function () {

  // load the controller's module
  beforeEach(module('citizendeskFrontendApp'));

  var SessionCtrl,
      scope,
      $httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _$httpBackend_) {
    $httpBackend = _$httpBackend_;
    scope = $rootScope.$new();
    $httpBackend
      .expectGET(globals.root)
      .respond(mocks.root);
    $httpBackend
      .expectGET(globals.root + 'reports?cacheBust=now&page=1&sort=%5B(%22produced%22,+1)%5D&where=%7B%22session%22:%22test-session-id%22%7D')
      .respond(mocks.reports['list-not-paginated']);
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
      }
    });
    $httpBackend.flush();
  }));

  it('gets the reports in the session', function() {
    expect(scope.reports.length).toBe(1);
  });

  describe('when starting a reply', function() {
    beforeEach(function() {
      scope.startReply('a-message-id');
    });
    it('registers the editing status', function() {
      expect(scope.editingId).toBe('a-message-id');
    });
    describe('when a reply is sent', function() {
      beforeEach(function() {
        $httpBackend
          .expectPOST(globals.root + 'proxy/mobile-reply/', {
            "report_id":"test-report-id"
            ,"message":"Please, tell us where you are!"
            ,"sensitive":false
            ,"language":"en"
          })
          .respond(200);
        var reports = angular.copy(mocks.reports['list-not-paginated']);
        reports._items.push({id_:'new report'});
        $httpBackend
          .expectGET(globals.root + 'reports?cacheBust=now&page=1&sort=%5B(%22produced%22,+1)%5D&where=%7B%22session%22:%22test-session-id%22%7D')
          .respond(reports);
        scope.sendReply({
          report_id: 'test-report-id',
          message: 'Please, tell us where you are!'
        });
        $httpBackend.flush();
      });
      it('adds the sent report to the session', function() {
        expect(scope.reports.length).toBe(2);
      });
      it('sends a message reply', function () {
        $httpBackend.verifyNoOutstandingRequest();
        $httpBackend.verifyNoOutstandingExpectation();
      });
      it('is not in editing status anymore', function() {
        expect(scope.editingId).toBeNull();
      });
    });
  });
});
