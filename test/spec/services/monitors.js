'use strict';
/* jshint camelcase: false */

describe('Service: Monitors', function () {

  // load the service's module
  beforeEach(module('citizendeskFrontendApp'));

  // instantiate service
  var Monitors, $httpBackend, promise;
  beforeEach(inject(function(_$httpBackend_, prefix) {
    $httpBackend = _$httpBackend_;
    $httpBackend
      .expectGET(prefix + '/twt_filters')
      .respond(mocks.twt_filters.list);
    $httpBackend
      .expectGET(prefix + '/twt_streams')
      .respond(mocks.twt_streams.list);
    $httpBackend
      .expectGET(prefix + '/twt_oauths')
      .respond(mocks.twt_oauths.list);
  }));
  beforeEach(inject(function (_Monitors_) {
    Monitors = _Monitors_;
  }));

  it('returns a promise for monitors', function() {
    promise = Monitors.getMonitors();
    expect('then' in promise).toBe(true);
  });
  it('has resources with proper methods', function() {
    expect(typeof Monitors.resources.filter.save).toBe('function');
  });
  describe('got monitors from the server', function() {
    var monitors;
    beforeEach(function() {
      Monitors.getMonitors().then(function(m) {
        monitors = m;
      });
      $httpBackend.flush();
    });
    xit('returns monitors', function() {
      expect(monitors.length).toBe(1);
    });
    xit('selects any monitor when none is in the route', function() {
      expect(Monitors.getBySlug(monitors).slug)
        .toBe('Ukraine');
    });
  });

});
