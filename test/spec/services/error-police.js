'use strict';

describe('Service: ErrorPolice', function () {

  // load the service's module
  beforeEach(module('citizendeskFrontendApp'));

  // instantiate service
  var ErrorPolice;
  beforeEach(inject(function (_ErrorPolice_) {
    ErrorPolice = _ErrorPolice_;
  }));

  it('identifies a known error', function () {
    var rejection = {
      'data': {
        '_status':'ERR',
        '_issues':{
          'password':{
            'minlength':1
          }
        }
      },
      'status':422,
      'config':{
        'method':'PATCH',
        'url':'https://api-root/users/<user id>?cachebuster=1415702474156',
        'data':{'password':'no'},
      },
      'statusText':'UNPROCESSABLE ENTITY'
    };
    expect(ErrorPolice.identify(rejection)).toEqual(['shortPassword']);
  });
  it('identifies an auth error', function() {
    var response = {
      'data':{
        '_status':'ERR',
        '_message':'',
        '_issues':{'credentials':1}
      },
      'status':400,
      'config':{
        'method':'POST',
        'statusText':'BAD REQUEST'
      }
    };
    expect(ErrorPolice.identifiers.authenticationFailure(response)).toBe(true);
  });
});
