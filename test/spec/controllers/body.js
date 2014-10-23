'use strict';

describe('Controller: BodyCtrl', function () {

  // load the controller's module
  beforeEach(module('citizendeskFrontendApp'));

  var BodyCtrl,
      scope,
      $window,
      size;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _$window_) {
    $window = _$window_;
    scope = $rootScope.$new();
    BodyCtrl = $controller('BodyCtrl', {
      $scope: scope,
      screenSize: {
        is: function(_size) {
          return _size === size;
        }
      }
    });
    spyOn($window.location, 'reload');
  }));

  it('should proxy a service', function () {
    expect(scope.service).toBeDefined();
  });
  it('collapses on click if the screen size is extra small', function() {
    size = 'xs';
    scope.clickNavigation();
    expect(scope.navCollapsed).toBeTruthy();
  });
  it('does not collapse if the screen size is not extra small', function() {
    scope.navCollapsed = false;
    size = 'XXXXL';
    scope.clickNavigation();
    expect(scope.navCollapsed).toBeFalsy();
  });
  it('reloads', function() {
    scope.reload();
    expect($window.location.reload).toHaveBeenCalled();
  });
});
