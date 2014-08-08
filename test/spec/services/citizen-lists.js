'use strict';

describe('Service: CitizenLists', function () {

  // load the service's module
  beforeEach(module('citizendeskFrontendApp'));

  // instantiate service
  var CitizenLists, api;
  beforeEach(inject(function(_api_){
    api = _api_;
    spyOn(api.citizen_lists, 'query').andCallThrough();
  }));
  beforeEach(inject(function (_CitizenLists_) {
    CitizenLists = _CitizenLists_;
  }));

  it('fetches the lists', function () {
    expect(api.citizen_lists.query).toHaveBeenCalled();
  });
});
