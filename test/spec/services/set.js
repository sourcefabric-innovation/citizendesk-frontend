'use strict';

// implementation of an enumerate for Javascript. just return the same
// value if in the set, otherwise raise an exception

describe('Service: setFactory', function () {

  // load the service's module
  beforeEach(module('citizendeskFrontendApp'));

  // instantiate service
  var setFactory;
  beforeEach(inject(function (_setFactory_) {
    setFactory = _setFactory_;
  }));

  it('generates a set', function () {
    var set = setFactory(['one', 'two', 'three']);
    expect(set('one')).toBe('one');
    expect(function(){
      set('four');
    }).toThrow();
  });

});
