'use strict';

describe('Directive: reportAuthor', function () {

  // load the directive's module
  beforeEach(module('citizendeskFrontendApp'));

  // load the template
  beforeEach(module('views/directives/report-author.html'));

  var element,
      scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
    scope.author = {
      authority: 'citizen_desk',
      identifiers: {
        user_display_name: 'Belinda'
      }
    };
  }));

  it('renders correctly', inject(function ($compile) {
    element = angular
      .element('<report-author author="author"></report-author>');
    element = $compile(element)(scope);
    scope.$digest();
    expect(element.text()).toMatch('Belinda');
  }));
});
