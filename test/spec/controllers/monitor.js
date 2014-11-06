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
    spyOn(api.reports, 'query').and.returnValue(deferred.promise);
    scope = $rootScope.$new();
    MonitorCtrl = $controller('MonitorCtrl', {
      $scope: scope,
      $routeParams: {
        id: 'monitor id'
      },
      api: api,
      Monitors: {
        getById: function() {
          return $q.when({
            user_id: {
              username: 'Francesco'
            }
          });
        }
      }
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
  it('catches exceptions in `linkTweetEntities`', function() {
    // the first report is fine, the second is random content and
    // would stop the whole process and prevent to add any report if
    // we would not catch the exception
    expect(function() {
      deferred.resolve({
        _items:[{
          original: {
            entities: {
              user_mentions: [],
              hashtags: [],
              urls: []
            }
          }
        }, {
          random: 'content'
        }]
      });
      scope.$digest();
    }).not.toThrow();
    expect(scope.reports.length).toBe(1);
  });
  it('gets the monitor', function() {
    scope.$digest();
    expect(scope.monitor).toBeDefined();
  });
});
