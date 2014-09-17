'use strict';

describe('Service: MoveToTheBeginning', function () {

  // load the service's module
  beforeEach(module('citizendeskFrontendApp'));

  // instantiate service
  var moveToTheBeginning;
  beforeEach(inject(function (_moveToTheBeginning_) {
    moveToTheBeginning = _moveToTheBeginning_;
  }));

  it('moves an item to the beginning of an array', function () {
    expect(moveToTheBeginning(1, ['a', 'b', 'c']))
      .toEqual(['b', 'a', 'c']);
  });
});
