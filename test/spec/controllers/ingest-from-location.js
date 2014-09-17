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
      };

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _api_, _$window_, _$httpBackend_) {
    api = _api_;
    $window = _$window_;
    spyOn($window.history, 'back');
    $httpBackend = _$httpBackend_;
    
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
    });
    it('calls the relevant interface', function() {
      $httpBackend
        .expectPOST(globals.root + 'proxy/ingest_from_location/')
        .respond();
      $httpBackend.verifyNoOutstandingExpectation();
    });
  });
});
