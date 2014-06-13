'use strict';

/* application wide status */

describe('Service: Application', function () {

  // load the service's module
  beforeEach(module('citizendeskFrontendApp'));

  // instantiate service
  var Application;
  beforeEach(inject(function (_Application_) {
    Application = _Application_;
  }));

  it('should do something', function () {
    expect(!!Application).toBe(true);
  });
  it('has a connection error property, initially null', function() {
    expect(Application.connectionError).toBeNull();
  });

});
