'use strict';

describe('Service: SavedQueries', function () {

  // load the service's module
  beforeEach(module('citizendeskFrontendApp'));

  // instantiate service
  var SavedQueries;
  beforeEach(inject(function (_SavedQueries_) {
    SavedQueries = _SavedQueries_;
  }));

  it('provides where queries', function () {
    expect(SavedQueries.getWhere('assigned')).toBeDefined();
  });
  it('complains when a query is not defined', function() {
    expect(function() {
      SavedQueries.getWhere('wrong');
    }).toThrow();
  });
});
