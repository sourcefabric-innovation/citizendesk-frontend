'use strict';

/* deprecated in favour of superdeskDate */

/*
 * date parsing may vary a lot depending on the browser
 */

describe('Service: ParseDate', function () {

  // load the service's module
  beforeEach(module('citizendeskFrontendApp'));

  // instantiate service
  var parseDate;
  beforeEach(inject(function (_parseDate_) {
    parseDate = _parseDate_;
  }));

  it('should parse a date', function () {
    var parsed = parseDate("2014-07-02T17:09:12+0000");
    expect(parsed instanceof Date).toBe(true);
    expect(parsed.toUTCString()).toBe("Wed, 02 Jul 2014 17:09:12 GMT");
  });

});
