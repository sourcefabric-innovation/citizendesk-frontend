'use strict';

describe('Controller: ConfigureAutoreplyCtrl', function () {

  // load the controller's module
  beforeEach(module('citizendeskFrontendApp'));

  var ConfigureAutoreplyCtrl,
      scope,
      api;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _api_) {
    api = _api_;
    scope = $rootScope.$new();
    
    spyOn(api.core_config, 'save').and.callThrough();
    spyOn(api.core_config, 'query').and.callThrough();

    ConfigureAutoreplyCtrl = $controller('ConfigureAutoreplyCtrl', {
      $scope: scope,
    });
  }));

  it('fetches the config', function () {
    expect(api.core_config.query).toHaveBeenCalled();
  });
  describe('after a response', function() {
    beforeEach(function(){
      api.core_config.def.query.resolve({_items:[{}]});
      scope.$digest();
    });
    it('exposes the config in the scope', function(){
      expect(scope.config).toBeDefined();
    });
    it('saves the config', function() {
      scope.save();
      expect(scope.disabled).toBeTruthy();
      api.core_config.def.save.resolve();
      scope.$digest();
      expect(scope.disabled).toBeFalsy();
    });
  });
});
