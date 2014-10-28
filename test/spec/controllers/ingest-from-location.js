'use strict';

describe('Controller: IngestFromLocationCtrl', function () {

  // load the controller's module
  beforeEach(module('citizendeskFrontendApp'));

  var IngestFromLocationCtrl,
      scope,
      api,
      $window,
      $httpBackend,
      session = {
        identity: angular.copy(mocks.auth.success)
      },
      $timeout;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _api_, _$window_, _$httpBackend_, _$timeout_) {
    api = _api_;
    $window = _$window_;
    spyOn($window.history, 'back');
    $httpBackend = _$httpBackend_;
    $timeout = _$timeout_;
    
    scope = $rootScope.$new();
    IngestFromLocationCtrl = $controller('IngestFromLocationCtrl', {
      $scope: scope,
      session: session
    });
  }));

  it('can cancel', function () {
    scope.cancel();
    expect($window.history.back).toHaveBeenCalled();
  });
  describe('on submit', function() {
    beforeEach(function() {
      scope.location = 'http://www.example.com';
      scope.submit();
      $httpBackend
        .expectPOST(globals.root + 'proxy/ingest_from_location/')
        .respond();
    });
    it('calls the relevant interface', function() {
      $httpBackend.verifyNoOutstandingExpectation();
    });
    describe('on response', function() {
      beforeEach(function() {
        $httpBackend.flush();
      });
      it('shows a message to the user', function() {
        expect(scope.showConfirm).toBeTruthy();
      });
      it('changes the page after the timeout', function() {
        $timeout.flush();
        expect(scope.showConfirm).toBeFalsy();
        expect($window.history.back).toHaveBeenCalled();
      });
    });
  });
  describe('when repeating', function() {
    beforeEach(function() {
      scope.repeat = true;
    });
    describe('on submit', function() {
      beforeEach(function() {
        scope.location = 'http://www.example.com';
        scope.submit();
        $httpBackend
          .expectPOST(globals.root + 'proxy/ingest_from_location/')
          .respond();
      });
      it('calls the relevant interface', function() {
        $httpBackend.verifyNoOutstandingExpectation();
      });
      describe('on response', function() {
        beforeEach(function() {
          $httpBackend.flush();
        });
        it('shows a message to the user', function() {
          expect(scope.showConfirm).toBeTruthy();
        });
        it('hides the message after the timeout', function() {
          $timeout.flush();
          expect(scope.showConfirm).toBeFalsy();
        });
      });
      describe('after a second submit', function() {
        beforeEach(function() {
          $httpBackend
            .expectPOST(globals.root + 'proxy/ingest_from_location/')
            .respond();
          scope.submit();
        });
        describe('on response', function() {
          beforeEach(function() {
            $httpBackend.flush();
          });
          it('shows a message to the user', function() {
            expect(scope.showConfirm).toBeTruthy();
          });
          it('hides the message after the timeout', function() {
            $timeout.flush();
            expect(scope.showConfirm).toBeFalsy();
          });
        });
      });
    });
  });
});
