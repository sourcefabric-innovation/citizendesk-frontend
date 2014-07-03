'use strict';

/*
 * function intended to add values from new pages to an existing
 * array. The purpose of the function is to keep existing values at
 * their place as much as possible, in order to avoid overhead for
 * angular and changes in the way the user sees the
 * result. Inefficiencies in the insertion algorithm are accepted,
 * considering that some elements are already visible to the user and
 * we are just adding new pages in the background
 */

describe('Service: AddNewValues', function () {

  // load the service's module
  beforeEach(module('citizendeskFrontendApp'));

  // instantiate service
  var addNewValues;
  beforeEach(inject(function (_addNewValues_) {
    addNewValues = _addNewValues_;
  }));

  it('adds values to an existing array, removing duplicates', function () {
    var existing = [{
      _id: 'a',
      value: 'a'
    }, {
      _id: 'b',
      value: 'b'
    }, {
      _id: 'c',
      value: 'c'
    }];
    var received = [{
      _id: 'c',
      value: 'c'
    }, {
      _id: 'd',
      value: 'd'
    }];
    var expected = [{
      _id: 'a',
      value: 'a'
    }, {
      _id: 'b',
      value: 'b'
    }, {
      _id: 'c',
      value: 'c'
    }, {
      _id: 'd',
      value: 'd'
    }];
    expect(existing).not.toEqual(expected);
    addNewValues(existing, received);
    expect(existing).toEqual(expected);
  });

});
