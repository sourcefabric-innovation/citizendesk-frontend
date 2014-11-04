'use strict';

describe('Controller: LoginCtrl', function () {

  // load the controller's module
  beforeEach(module('citizendeskFrontendApp'));

  var LoginCtrl,
      scope,
      watchExpression,
      watchListener,
      $modal = {},
      session = {
        token: 'i am a token!'
      };

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    $modal.open = jasmine.createSpy();
    spyOn(scope, '$watch').andCallFake(function(expression, listener) {
      watchExpression = expression;
      watchListener = listener;
    });
    LoginCtrl = $controller('LoginCtrl', {
      $scope: scope,
      $modal: $modal,
      session: session
    });
    session.clear = jasmine.createSpy('session clear');
  }));

  it('shows the modal if the token is missing', inject(function($q) {
    var deferred = $q.defer();
    watchListener();
    scope.$digest(); // in order to resolve the $q promise
    expect($modal.open).toHaveBeenCalled();
  }));
  it('stores an username if the identity is available', function() {
    session.identity = { username:'Francesco' };
    watchListener();
    scope.$digest();
    expect(scope.username).toBe('Francesco');
  });
  it('does not show the modal if the token is there', inject(function($q) {
    var deferred = $q.defer();
    watchListener(session.token);
    scope.$digest(); // in order to resolve the $q promise
    expect($modal.open).not.toHaveBeenCalled();
  }));
  it('gets the session token', function() {
    var token = scope.watcher();
    expect(token).toBe('i am a token!');
  });
  it('deletes and clears the session', inject(function($httpBackend) {
    session.getSessionHref = function() { return 'href'; };
    $httpBackend
      .expect(
        'DELETE',
        globals.root+'href'
      ).respond(200);
    scope.logout();
    $httpBackend.flush();
    scope.$digest();
    expect(session.clear).toHaveBeenCalled();
  }));
  it('clears the session even when no reference is given', function() {
    session.getSessionHref = function() {};
    scope.logout();
    scope.$digest();
    expect(session.clear).toHaveBeenCalled();
  });
});
