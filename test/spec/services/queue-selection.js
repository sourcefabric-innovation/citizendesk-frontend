'use strict';

describe('Service: QueueSelection', function () {

  // load the service's module
  beforeEach(module('citizendeskFrontendApp'));

  // instantiate service
  var QueueSelection;
  beforeEach(inject(function (_QueueSelection_) {
    QueueSelection = _QueueSelection_;
  }));

  it('deletes the description on page change', function () {
    QueueSelection.description = 'description for an old page';
    QueueSelection.onLocationChangeSuccess();
    expect(QueueSelection.description).toBeUndefined();
  });
});
