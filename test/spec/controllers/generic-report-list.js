'use strict';

describe('Controller: GenericReportListCtrl', function () {

  // load the controller's module
  beforeEach(module('citizendeskFrontendApp'));

  var scope,
      SimpleReportList = {};

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    SimpleReportList.init = jasmine.createSpy('service init');

    scope = $rootScope.$new();
    $controller('GenericReportListCtrl', {
      $scope: scope,
      SimpleReportList: SimpleReportList,
      $routeParams: {query: 'published_debunked'}
    });
  }));

  it('initialises the service', function () {
    expect(SimpleReportList.init).toHaveBeenCalled();
  });
});
