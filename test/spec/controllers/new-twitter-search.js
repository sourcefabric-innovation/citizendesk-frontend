'use strict';

describe('Controller: NewTwitterSearchCtrl', function () {

  // load the controller's module
  beforeEach(module('citizendeskFrontendApp'));

  var NewTwitterSearchCtrl,
      scope,
      TwitterSearches = {},
      $location = {},
      def;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $q) {
    scope = $rootScope.$new();
    NewTwitterSearchCtrl = $controller('NewTwitterSearchCtrl', {
      $scope: scope,
      TwitterSearches: TwitterSearches,
      $location: $location
    });
    $location.url = jasmine.createSpy('location url');
    def = $q.defer();
    TwitterSearches.create = function() {
      return def.promise;
    };
    spyOn(TwitterSearches, 'create').andCallThrough();
  }));

  it('can submit', function () {
    scope.submit();
    def.resolve();
    scope.$digest();
    expect($location.url).toHaveBeenCalled();
  });
});
