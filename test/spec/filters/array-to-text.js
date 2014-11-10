'use strict';

describe('Filter: arrayToText', function () {

  // load the filter's module
  beforeEach(module('citizendeskFrontendApp'));

  // initialize a new instance of the filter before each test
  var arrayToText;
  beforeEach(inject(function ($filter) {
    arrayToText = $filter('arrayToText');
  }));

  it('formats an array for printing', function () {
    var a = ['a', 2, 'c'];
    expect(arrayToText(a)).toBe('a, 2, c');
  });

});
