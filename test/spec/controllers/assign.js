'use strict';

describe('Controller: AssignCtrl', function () {

  // load the controller's module
  beforeEach(module('citizendeskFrontendApp'));

  var AssignCtrl,
      scope,
      $httpBackend,
      $window = {
        history: {
          back: jasmine.createSpy()
        }
      },
      $rootScope,
      api = {
        reports: {}
      };

  // very nested mock structure!
  var reportMock = {
    _id: 'test-report-id',
    _links: {
      'self': {
        href: '/test-report-self-link/'
      }
    }
  },
      promiseMock = {
        then: function(f) {
          f({report: reportMock});
        }
      },
      pageBroker = {
        getData: function() {
          return promiseMock;
        }
      };

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, _$rootScope_, _$httpBackend_) {
    $httpBackend = _$httpBackend_;
    $rootScope = _$rootScope_;
    scope = $rootScope.$new();
    AssignCtrl = $controller('AssignCtrl', {
      $scope: scope,
      $routeParams: {
        report_id: 'test-report-id'
      },
      Assign: { // this is the assign service
        users: angular.copy(mocks.users.list._items),
        updateTotals: jasmine.createSpy()
      },
      $window: $window,
      PageBroker: pageBroker,
      session: {
        identity: mocks.auth.success
      },
      api: api
    });
  }));

  it('knows the user identity', function() {
    expect(scope.identity._id).toBe('53bab5339c61671f63bc3788');
  });
  it('proxies the service data', function () {
    expect(scope.users.length).toBe(4);
  });
  it('fetches a valid report', function() {
    expect(scope.report).toBeDefined();
    expect(scope.report._links.self.href)
      .toBe('/test-report-self-link/');
  });
  it('assigns to an user', inject(function($q) {
    var deferred = $q.defer();
    api.reports.update = function(){};
    spyOn(api.reports, 'update').andReturn(deferred.promise);

    scope.assignTo('test-user-id');
    expect(api.reports.update).toHaveBeenCalled();
    expect(api.reports.update.mostRecentCall.args[1])
      .toEqual({
        assignments: [{user_id: 'test-user-id'}],
        proto: false
      });
    expect(scope.disabled).toBe(true);

    deferred.resolve({});
    $rootScope.$digest();
    expect($window.history.back).toHaveBeenCalled();
  }));
});
