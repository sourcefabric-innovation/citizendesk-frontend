'use strict';

describe('Service: FilterGrouper', function () {

  // load the service's module
  beforeEach(module('citizendeskFrontendApp'));

  // instantiate service
  var FilterGrouper;
  var filter = {
    track: ['track1', 'track2'],
    follow: ['follow1', 'follow2'],
    location: {
    }
  };
  beforeEach(inject(function (_FilterGrouper_) {
    FilterGrouper = _FilterGrouper_;
  }));

  it('should create a slug from a filter', function () {
    expect(FilterGrouper.getSlug(filter))
      .toBe('track1, track2, follow1, follow2');
  });
  it('should create a description from a filter', function () {
    expect(FilterGrouper.getDescription(filter))
      .toBe('track1, track2, follow1, follow2');
  });

});
