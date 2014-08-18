'use strict';

// implementation of an enumerate for Javascript. just return the same
// value if in the set, otherwise raise an exception

describe('Service: Set', function () {

  // load the service's module
  beforeEach(module('citizendeskFrontendApp'));

  // instantiate service
  var Set;
  beforeEach(inject(function (_Set_) {
    Set = _Set_;
  }));

  it('generates a set', function () {
    var set = Set(['one', 'two', 'three']);
    expect(set('one')).toBe('one');
    expect(function(){
      set('four');
    }).toThrow();
  });

});
