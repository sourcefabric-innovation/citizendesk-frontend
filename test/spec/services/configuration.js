'use strict';

describe('Service: Configuration', function () {

  // load the service's module
  beforeEach(module('citizenfrontApp'));

  // instantiate service
  var configuration;
  beforeEach(inject(function (_configuration_) {
    configuration = _configuration_;
  }));

  it('should do something', function () {
    expect(!!configuration).toBe(true);
  });
  it('has a root parameter', function() {
    expect(configuration.root).toBe('http://127.0.0.1:5000');
  });

});
