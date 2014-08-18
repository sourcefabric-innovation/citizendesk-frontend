'use strict';

describe('Directive: commonReportDetailPart', function () {

  // load the directive's module
  beforeEach(module('citizendeskFrontendApp'));

  // load the template
  beforeEach(module('views/directives/common-report-detail-part.html'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('loads the template', inject(function ($compile) {
    element = angular.element('<div common-report-detail-part></div>');
    element = $compile(element)(scope);
    scope.$digest();
    expect(element.text()).toMatch('Published');
  }));
});
