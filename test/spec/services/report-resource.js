'use strict';

describe('Service: ReportResource', function () {

  // load the service's module
  beforeEach(module('citizenfrontApp'));

  // instantiate service
  var ReportResource, $httpBackend;
  beforeEach(inject(function (_ReportResource_, _$httpBackend_) {
    ReportResource = _ReportResource_;
    $httpBackend = _$httpBackend_;
  }));

  it('should do something', function () {
    expect(!!ReportResource).toBe(true);
  });
  it('tries to save a report on the right location', function() {
    var r = new ReportResource({
      content: 'test content'
    });
    r.$save();
    $httpBackend
      .expectPOST(root + '/reports')
      .respond({});
    $httpBackend.verifyNoOutstandingRequest();
    $httpBackend.verifyNoOutstandingExpectation();
  });

});
