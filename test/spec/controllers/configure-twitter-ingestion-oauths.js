'use strict';

describe('Controller: ConfigureTwitterIngestionOauthsCtrl', function () {

  // load the controller's module
  beforeEach(module('citizendeskFrontendApp'));

  var ConfigureTwitterIngestionOauthsCtrl,
      scope,
      api = {
        twt_oauths: {
          save: function() {},
          query: function() {}
        }
      },
      $q,
      deferreds = {};

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _$q_) {
    $q = _$q_;
    scope = $rootScope.$new();
    deferreds.query = $q.defer();
    spyOn(api.twt_oauths, 'query').andReturn(deferreds.query.promise);
    ConfigureTwitterIngestionOauthsCtrl = $controller('ConfigureTwitterIngestionOauthsCtrl', {
      $scope: scope,
      api: api,
      session: {
        identity: {
          _id: 'test user id'
        }
      }
    });
  }));

  it('asks for keys', function () {
    expect(api.twt_oauths.query).toHaveBeenCalled();
  });
  describe('after receiving the keys', function() {
    beforeEach(function() {
      deferreds.query.resolve({
        _items: [{
          _id: 'key id',
          spec: 'whatever'
        }]
      });
      scope.$digest();
    });
    it('has a key', function() {
      expect(scope.key).toBeTruthy();
    });
  });
});
