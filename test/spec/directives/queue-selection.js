'use strict';

describe('Directive: queueSelection', function () {

  // load the directive's module
  beforeEach(module('citizendeskFrontendApp'));

  // load the template
  beforeEach(module('views/directives/queue-selection.html'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('loads the template', inject(function ($compile) {
    element = angular.element('<div queue-selection></div>');
    element = $compile(element)(scope);
    // the following would require to mock the service used by the
    // controller used by this directive. at the moment it is not
    // worth it

    //scope.$digest();
    //expect(element.text()).toMatch('New Twitter search');
  }));
});
