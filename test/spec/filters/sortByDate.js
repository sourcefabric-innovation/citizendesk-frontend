'use strict';

describe('Filter: sortByDate', function () {

  // load the filter's module
  beforeEach(module('citizendeskFrontendApp'));

  // initialize a new instance of the filter before each test
  var sortByDate;
  beforeEach(inject(function ($filter) {
    sortByDate = $filter('sortByDate');
  }));

  it('returns the sorted array', function () {
    var unsorted = [{
      prop: '2014-07-02T17:09:12+0000'
    }, {
      prop: '2014-07-01T12:16:24+0000'
    }, {
      prop: '2014-07-02T14:20:36+0000'
    }];
    expect(sortByDate(unsorted, 'prop')).toEqual([{
      'prop':'2014-07-01T12:16:24+0000'
    },{
      'prop':'2014-07-02T14:20:36+0000'
    },{
      'prop':'2014-07-02T17:09:12+0000'
    }]);
  });
  it('can sort the newest first', function () {
    var unsorted = [{
      prop: '2014-07-02T17:09:12+0000'
    }, {
      prop: '2014-07-01T12:16:24+0000'
    }, {
      prop: '2014-07-02T14:20:36+0000'
    }];
    expect(sortByDate(unsorted, 'prop', true)).toEqual([{
      'prop':'2014-07-02T17:09:12+0000'
    },{
      'prop':'2014-07-02T14:20:36+0000'
    },{
      'prop':'2014-07-01T12:16:24+0000'
    }]);
  });
  it('ignores missing input', function() {
    expect(sortByDate(null)).toEqual([]);
  });
});
