'use strict';

describe('Service: Queues', function () {

  // load the service's module
  beforeEach(module('citizendeskFrontendApp'));

  // instantiate service
  var Queues;
  beforeEach(inject(function (_Queues_) {
    Queues = _Queues_;
  }));

  it('should do something', function () {
    expect(!!Queues).toBe(true);
  });
  it('provides a promises', function() {
    expect(Queues.promise).toBeDefined();
  });

});
