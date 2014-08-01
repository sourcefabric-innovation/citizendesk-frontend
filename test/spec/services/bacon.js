'use strict';

describe('Service: Bacon', function () {

  // load the service's module
  beforeEach(module('citizendeskFrontendApp'));

  // instantiate service
  var Bacon;
  beforeEach(inject(function (_Bacon_) {
    Bacon = _Bacon_;
  }));

  it('provides Bacon', function () {
    expect(Bacon).toBeDefined();
  });

});
