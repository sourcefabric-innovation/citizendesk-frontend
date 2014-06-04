'use strict';

/*

 if the interceptor finds an etag in a sent object and the method is
 `PUT` or `PATCH` it copies the etag to an `If-Match` header, in order
 to work nicely with python Eve conditional requests

 */

describe('Service: EtagInterceptor', function () {

  // load the service's module
  beforeEach(module('citizendeskFrontendApp'));

  // instantiate service
  var EtagInterceptor;
  beforeEach(inject(function (_etagInterceptor_) {
    EtagInterceptor = _etagInterceptor_;
  }));

  it('sets the If-Match header', function () {
    var config = {
      method: 'PUT',
      data: {
        _etag: 'abcdef'
      }
    };
    var converted = EtagInterceptor.request(config);
    expect(converted.headers['If-Match']).toBe('abcdef');
  });

});
