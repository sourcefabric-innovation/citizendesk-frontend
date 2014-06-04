'use strict';

describe('Service: QueueSelection', function () {

  // load the service's module
  beforeEach(module('citizendeskFrontendApp'));

  // instantiate service
  var QueueSelection;
  beforeEach(inject(function (_QueueSelection_) {
    QueueSelection = _QueueSelection_;
  }));

  it('should do something', function () {
    expect(!!QueueSelection).toBe(true);
  });

});
