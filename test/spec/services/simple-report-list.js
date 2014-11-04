'use strict';

describe('Service: SimpleReportList', function () {

  // load the service's module
  beforeEach(module('citizendeskFrontendApp'));

  // instantiate service
  var SimpleReportList,
      PageBroker = {},
      scope;
  beforeEach(module(function ($provide) {
    PageBroker.load = jasmine.createSpy('page broker load');
    $provide.value('PageBroker', PageBroker);
  }));
  beforeEach(inject(function (_SimpleReportList_, $rootScope) {
    scope = $rootScope.$new();
    SimpleReportList = _SimpleReportList_;
    SimpleReportList.init(scope, {}, {parameters: {}});
  }));

  it('assigns a report', function () {
    scope.assign({a: 'report'});
    expect(PageBroker.load).toHaveBeenCalled();
  });
  it('fetches multiple report pages', inject(function(api) {
    api.reports.def.query.resolve({
      _items: [],
      _links: {
        next: 'whatever'
      }
    });
    api.reports.reset.query();
    spyOn(api.reports, 'query').and.callThrough();
    scope.$digest();
    expect(api.reports.query).toHaveBeenCalled();
  }));
});
