'use strict';

describe('Service: ScrollTo', function () {

  // load the service's module
  beforeEach(module('citizendeskFrontendApp'));

  // instantiate service
  var ScrollTo,
      spy;
  beforeEach(inject(function (_ScrollTo_) {
    ScrollTo = _ScrollTo_;
    spy = jasmine.createSpy('handler');
  }));

  it('calls handlers added before events', function() {
    ScrollTo.target.onValue(spy);
    ScrollTo.targetStream.push('a target');
    expect(spy).toHaveBeenCalled();
  });
  it('calls handlers added after events', function () {
    ScrollTo.targetStream.push('a target');
    ScrollTo.target.onValue(spy);
    expect(spy).toHaveBeenCalledWith('a target');
  });
});
