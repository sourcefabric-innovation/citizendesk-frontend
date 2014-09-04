'use strict';

describe('Directive: reportSummary', function () {

  // load the directive's module
  beforeEach(module('citizendeskFrontendApp'));

  // load the templates
  beforeEach(module('views/directives/report-summary-buttons.html'));
  beforeEach(module('views/directives/report-summary.html'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('loads the template', inject(function ($compile) {
    element = angular.element('<div report-summary></div>');
    element = $compile(element)(scope);
    scope.$digest();
    expect(element.text()).toMatch('Check');
  }));
});
