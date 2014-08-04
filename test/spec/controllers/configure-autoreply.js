'use strict';

describe('Controller: ConfigureAutoreplyCtrl', function () {

  // load the controller's module
  beforeEach(module('citizendeskFrontendApp'));

  var ConfigureAutoreplyCtrl,
      scope,
      deferreds = {},
      $q,
      api;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _$q_, _api_) {
    $q = _$q_;
    api = _api_;
    scope = $rootScope.$new();
    
    deferreds.query = $q.defer();
    deferreds.save = $q.defer();
    spyOn(api.core_config, 'save').andReturn(deferreds.save.promise);
    spyOn(api.core_config, 'query').andReturn(deferreds.query.promise);

    ConfigureAutoreplyCtrl = $controller('ConfigureAutoreplyCtrl', {
      $scope: scope,
      api: api
    });
  }));

  it('fetches the config', function () {
    expect(api.core_config.query).toHaveBeenCalled();
  });
  describe('after a response', function() {
    beforeEach(function(){
      deferreds.query.resolve({_items:[{}]});
      scope.$digest();
    });
    it('exposes the config in the scope', function(){
      expect(scope.config).toBeDefined();
    });
  });
});
