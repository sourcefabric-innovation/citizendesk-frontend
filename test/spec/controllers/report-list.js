'use strict';

describe('Controller: ReportListCtrl', function () {

  // load the controller's module
  beforeEach(module('citizenfrontApp'));

  var ReportListCtrl,
    scope,
  $httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _$httpBackend_) {
    scope = $rootScope.$new();
    $httpBackend = _$httpBackend_;
    $httpBackend
      .expectGET(root + '/reports')
      .respond([{},{},{}]);
    ReportListCtrl = $controller('ReportListCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of reports to the scope', function () {
    $httpBackend.flush();
    expect(scope.reports.length).toBe(3);
    $httpBackend.verifyNoOutstandingExpectation();
  });
});
