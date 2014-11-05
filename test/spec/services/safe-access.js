'use strict';

describe('Service: safeAccess', function () {

  // load the service's module
  beforeEach(module('citizendeskFrontendApp'));

  // instantiate service
  var safeAccess;
  beforeEach(inject(function (_safeAccess_) {
    safeAccess = _safeAccess_;
  }));

  it('works as expected', function () {
    expect(safeAccess({
      one: {
        two: {
          three: true
        }
      }
    }, 'one.two.three')).toBe(true);
  });
});
