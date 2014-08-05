'use strict';

/* this directive was forked from the normal `report-summary` because
of the twitter display requirements */

describe('Directive: tweetSummary', function () {

  // load the directive's module
  beforeEach(module('citizendeskFrontendApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('provides the expected markup', inject(function ($compile) {
    element = angular.element('<div tweet-summary></div>');
    element = $compile(element)(scope);
    scope.$digest();
    expect(element.text()).toMatch('Check');
  }));
});
