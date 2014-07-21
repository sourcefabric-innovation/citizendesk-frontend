'use strict';

/* the report pages and controllers depend on the report type, but
they have some common logic, which is contained in this service */

describe('Service: Report', function () {

  var Report,
      $httpBackend,
      $rootScope,
      api = {
        reports: globals.mockEndpoint({}, 'save', {})
      },
      coverage = {
        _id: 'coverage id'
      };
  // load the service's module
  beforeEach(module('citizendeskFrontendApp'));
  // mock dependencies
  beforeEach(module(function($provide) {
    $provide.value('session', {
      identity: {
        _id: 'test user id'
      }
    });
    $provide.value('api', api);
  }));
  beforeEach(inject(function (_Report_, _$httpBackend_, _$rootScope_) {
    Report = _Report_;
    $httpBackend = _$httpBackend_;
    $rootScope = _$rootScope_;
  }));

  it('can check whether a report is published or not', function() {
    expect(Report.checkPublished({
      coverages: {
        published: ['a coverage id']
      }
    }))
      .toBe(true);
  });

  describe('when asked for publishing', function() {
    var toBePublished = angular
          .copy(mocks.reports['53cd05a09c616712c900052d']),
        promise;
    beforeEach(function() {
      spyOn(api.reports, 'save').andCallThrough();
      promise = Report.publish(toBePublished, coverage);
    });
    it('asks to set the behalf property', function () {
      expect(api.reports.save.mostRecentCall.args[1])
        .toEqual({on_behalf_id:'test user id'});
    });
    describe('when the behalf property is saved', function() {
      beforeEach(function() {
        api.reports.flush();
        $httpBackend
          .expectPOST(globals.root+'proxy/publish', {
            report: '53cd05a09c616712c900052d',
            coverage: 'coverage id'
          })
          .respond(201);
      });
      it('asks for publishing to the backend', function() {
        $httpBackend.verifyNoOutstandingExpectation();
      });
      describe('when the server answers', function() {
        beforeEach(function() {
          $httpBackend.flush();
        });
        it('resolves the promise', function() {
          var spy = jasmine.createSpy();
          promise.then(spy);
          $rootScope.$digest();
          expect(spy).toHaveBeenCalled();
        });
      });
    });
  });
  describe('when asked for unpublishing', function() {
    var toBePublished = angular
          .copy(mocks.reports['53cd05a09c616712c900052d']),
        promise;
    beforeEach(function() {
      $httpBackend
        .expectPOST(globals.root+'proxy/unpublish', {
          report: '53cd05a09c616712c900052d',
          coverage: 'coverage id'
        })
        .respond(201);
      promise = Report.unpublish(toBePublished, coverage);
    });
    it('asks to unpublish', function () {
      $httpBackend.verifyNoOutstandingExpectation();
    });
    describe('when the server answers', function() {
      beforeEach(function() {
        $httpBackend.flush();
      });
      it('resolves the promise', function() {
        var spy = jasmine.createSpy();
        promise.then(spy);
        $rootScope.$digest();
        expect(spy).toHaveBeenCalled();
      });
    });
  });
});
