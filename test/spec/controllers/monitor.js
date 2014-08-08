'use strict';

describe('Controller: MonitorCtrl', function () {

  // load the controller's module
  beforeEach(module('citizendeskFrontendApp'));

  var MonitorCtrl,
      scope,
      $q,
      api = {
        reports: {
          query: function(){}
        }
      },
      deferred;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _$q_) {
    $q = _$q_;
    deferred = $q.defer();
    spyOn(api.reports, 'query').andReturn(deferred.promise);
    scope = $rootScope.$new();
    MonitorCtrl = $controller('MonitorCtrl', {
      $scope: scope,
      $routeParams: {
        id: 'monitor id'
      },
      api: api
    });
  }));

  it('asks for reports', function () {
    expect(api.reports.query).toHaveBeenCalled();
  });
  it('attaches reports to the scope', function() {
    deferred.resolve({_items:[{
      original: {
        entities: {
          user_mentions: [],
          hashtags: [],
          urls: []
        }
      }
    }]});
    scope.$digest();
    expect(scope.reports.length).toBe(1);
  });
});
