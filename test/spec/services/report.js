'use strict';

/* the report pages and controllers depend on the report type, but
they have some common logic, which is contained in this service */

describe('Service: Report', function () {

  var Report,
      $httpBackend,
      $rootScope,
      api = { reports: {}},
      coverage = {
        _id: 'coverage id'
      },
      reportsSaveDeferred,
      initAuth = function(){},
      $window = {};
  // load the service's module
  beforeEach(module('citizendeskFrontendApp'));
  // mock dependencies
  beforeEach(module(function($provide) {
    $provide.value('session', {
      identity: {
        _id: 'test user id'
      }
    });
    /* playing with `$http` triggers somehow `$locationChangeStart`,
    which triggers the authentication and raises an error. replacing
    the autenthication with this empty function */
    $provide.value('initAuth', initAuth);
    $provide.value('api', api);
    $provide.value('$window', $window);
  }));
  beforeEach(inject(function (_Report_, _$httpBackend_, _$rootScope_, $q) {
    Report = _Report_;
    $httpBackend = _$httpBackend_;
    $rootScope = _$rootScope_;
    reportsSaveDeferred = $q.defer();
    api.reports.save = function(){};
    spyOn(api.reports, 'save').andReturn(reportsSaveDeferred.promise);
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
      promise = Report.publish(toBePublished, coverage);
    });
    it('asks to set the behalf property', function () {
      expect(api.reports.save.mostRecentCall.args[1])
        .toEqual({on_behalf_id:'test user id'});
    });
    describe('when the behalf property is saved', function() {
      beforeEach(function() {
        $httpBackend
          .expectPOST(globals.root+'proxy/publish', {
            report: '53cd05a09c616712c900052d',
            coverage: 'coverage id'
          })
          .respond(201);
        reportsSaveDeferred.resolve({});
        $rootScope.$digest();
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
  describe('the provided verification handler', function(){
    var handler,
        $scope;
    beforeEach(function(){
      $window.alert = jasmine.createSpy('window alert');
      $scope = {
        report: {
          steps: [{
            done: true
          }, {
            done: false
          }]
        }
      };
      handler = Report.getVerificationHandler($scope);
    });
    it('complains about changing from verified to unverified', function(){
      handler(true, false);
      expect($window.alert).toHaveBeenCalled();
    });
    it('complains when marking as verified without doing the steps', function(){
      handler(false, true);
      expect($window.alert).toHaveBeenCalled();
    });
    it('is happy when everything is regular', function(){
      $scope.report.steps[1].done = true;
      handler(false, true);
      expect($window.alert).toHaveBeenCalled();
    });
    it('has no problems when the steps are missing', function(){
      $scope = {
        report: {}
      };
      handler = Report.getVerificationHandler($scope);
      expect(function(){
        handler(false, true);
      }).not.toThrow();
    });
  });
});
