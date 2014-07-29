'use strict';

/*

 Superdesk defines a format to be used for dates, on top of
 Eve. Testing is important here, also because date objects varies a
 lot depending on the browser

 */

describe('Service: superdeskDate', function () {

  // load the service's module
  beforeEach(module('citizendeskFrontendApp'));

  // instantiate service
  var superdeskDate;
  beforeEach(inject(function (_superdeskDate_) {
    superdeskDate = _superdeskDate_;
  }));

  it('parses a date', function () {
    var parsed = superdeskDate.parse("2014-07-02T17:09:12+0000");
    expect(parsed instanceof Date).toBe(true);
    expect(parsed.toUTCString()).toBe("Wed, 02 Jul 2014 17:09:12 GMT");
  });
  it('consistently renders', function () {
    var original = "2014-07-02T17:09:12+0000",
        parsed = superdeskDate.parse(original),
        rendered = superdeskDate.render(parsed);
    expect(rendered).toBe(original);
  });
  it('consistently parses', function () {
    var original = new Date(0),
        rendered = superdeskDate.render(original),
        parsed = superdeskDate.parse(rendered);
    expect(parsed.toUTCString()).toBe(original.toUTCString());
  });
});
