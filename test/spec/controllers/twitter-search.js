'use strict';

describe('Controller: TwitterSearchCtrl', function () {

  // load the controller's module
  beforeEach(module('citizendeskFrontendApp'));

  var TwitterSearchCtrl,
      scope,
      PageBroker = {
        load: jasmine.createSpy()
      };

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TwitterSearchCtrl = $controller('TwitterSearchCtrl', {
      $scope: scope,
      $routeParams: {
      },
      PageBroker: PageBroker
    });
  }));

  it('attaches a queue to the scope', function () {
    expect(scope.queue).toBeDefined();
  });
  it('assigns', function() {
    var report = { _id: 'report id' }
    scope.assign(report);
    expect(PageBroker.load.mostRecentCall.args).toEqual([
      '/assign/',
      { report: report }
    ]);
  });
});
