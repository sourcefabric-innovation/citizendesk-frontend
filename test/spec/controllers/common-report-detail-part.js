'use strict';

describe('Controller: CommonReportDetailPartCtrl', function () {

  // load the controller's module
  beforeEach(module('citizendeskFrontendApp'));

  var scope,
      $httpBackend,
      Coverages = {},
      $window = {
        history: {
          back: function(){}
        }
      },
      def = {},
      $q,
      api,
      coverageUniqueId = '53c53ab09c61671221000000',
      session = {
        identity: {
          _id: 'test user id'
        }
      },
      $rootScope,
      reportStatuses;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, _$rootScope_, _$httpBackend_, _$q_, _api_, _reportStatuses_) {
    $q = _$q_;
    api = _api_;
    spyOn(api.reports, 'getById').andCallThrough();
    spyOn(api.reports, 'save').andCallThrough();
    spyOn(api.steps, 'query').andCallThrough();
    $httpBackend = _$httpBackend_;
    def.coverages = $q.defer();
    Coverages.promise = def.coverages.promise;
    $rootScope = _$rootScope_;
    reportStatuses = _reportStatuses_;

    scope = $rootScope.$new();
    $controller('CommonReportDetailPartCtrl', {
      $scope: scope,
      $routeParams: {id: 'abcdef'},
      Coverages: Coverages,
      $window: $window,
      session: session
    });
  }));
  it('asks for its report', function() {
    expect(api.reports.getById).toHaveBeenCalled();
  });
  describe('started without steps', function() {
    beforeEach(function() {
      api.reports.def.getById
        .resolve(angular.copy(mocks.reports['538df48f9c616729ad000035']));
      api.steps.def.query.resolve(mocks.steps.list);
      scope.$digest();
    });
    it('attaches a report to the scope', function () {
      expect(scope.report).toBeDefined();
    });
    it('can check whether a report is published or not', function() {
      expect(scope.isPublished).toBe(false);
    });
  });
  describe('starting with existent steps', function() {
    beforeEach(inject(function ($controller, $rootScope) {
      api.reports.def.getById
        .resolve(angular.copy(mocks.reports['538df48f9c616729ad000035']));
      api.steps.def.query
        .resolve(mocks.steps.list);
      scope.$digest();
    }));
  });
  describe('starting assigned to an existent coverage', function() {
    beforeEach(inject(function ($controller, $rootScope) {
      var mock = angular.copy(mocks.coverages.list._items);
      mock[0].uuid = coverageUniqueId;
      def.coverages.resolve(mock);

      var rep = angular.copy(mocks.reports['538df48f9c616729ad000035']);
      rep.coverages = {
        outgested: [coverageUniqueId],
        published: [coverageUniqueId]
      };
      api.reports.def.getById.resolve(rep);
      api.steps.def.query.resolve(mocks.steps.list);
      scope.$digest();
    }));
    it('can check whether a report is published or not', function() {
      expect(scope.isPublished).toBe(true);
    });
    it('picks the coverage as the selected one', function(){
      expect(scope.selectedCoverage.uuid).toBe(coverageUniqueId);
    });
  });
  describe('when asked for publishing', function() {
    var coverage = { uuid: coverageUniqueId},
        toBePublished = angular
          .copy(mocks.reports['53cd05a09c616712c900052d']),
        promise;
    beforeEach(function() {
      api.reports.def.getById
        .resolve(angular.copy(mocks.reports['538df48f9c616729ad000035']));

      var mock = angular.copy(mocks.coverages.list._items);
      mock[0].uuid = 'coverage unique id';
      def.coverages.resolve(mock);
      scope.$digest();

      scope.selectedCoverage = mock[0];
      scope.publish(coverage);
    });
    it('asks to set the behalf property', function () {
      expect(api.reports.save).toHaveBeenCalled();
      expect(api.reports.save.mostRecentCall.args[1])
        .toEqual({on_behalf_id:'test user id'});
    });
    describe('when the behalf property is saved', function() {
      beforeEach(function() {
        $httpBackend
          .expectPOST(globals.root+'proxy/publish', {
            report: '53ba73019c6167462300068b',
            coverage: 'coverage unique id'
          })
          .respond(201);
        api.reports.def.save.resolve(scope.report);
        $rootScope.$digest();
      });
      it('asks for publishing to the backend', function() {
        $httpBackend.verifyNoOutstandingExpectation();
      });
      describe('when the server answers', function() {
        beforeEach(function() {
          $httpBackend.flush();
        });
        it('is enabled again', function() {
          $rootScope.$digest();
          expect(scope.disablePublish).toBe(false);
        });
      });
    });
  });
  describe('when asked for unpublishing', function() {
    var coverage = { uuid: coverageUniqueId},
        toBePublished = angular
          .copy(mocks.reports['53cd05a09c616712c900052d']),
        promise;
    beforeEach(function() {
      api.reports.def.getById
        .resolve(angular.copy(mocks.reports['538df48f9c616729ad000035']));
      scope.$digest();
      scope.selectedCoverage = {
        uuid: 'coverage unique id'
      };
      $httpBackend
        .expectPOST(globals.root+'proxy/unpublish', {
          report: '53ba73019c6167462300068b',
          coverage: 'coverage unique id'
        })
        .respond(201);
      scope.unpublish(coverage);
    });
    it('asks to unpublish', function () {
      $httpBackend.verifyNoOutstandingExpectation();
    });
    describe('when the server answers', function() {
      beforeEach(function() {
        $httpBackend.flush();
      });
      it('enables again', function() {
        $rootScope.$digest();
        expect(scope.disablePublish).toBe(false);
      });
    });
  });
  describe('the step change handler', function() {
    var mandatory = {
          done: false,
          mandatory: true
        },
        optional = {
          done: true,
          mandatory: false
        },
        steps = [mandatory, optional];
    beforeEach(function() {
      api.reports.def.getById
        .resolve(angular.copy(mocks.reports['538df48f9c616729ad000035']));
      scope.$digest();
      scope.report.steps = steps;
      scope.$digest();
    });
    it('disables verification when a mandatory step is missing', function() {
      expect(scope.verificationDisabled).toBe(true);
    });
    it('enables verification when an optional step is missing', function() {
      mandatory.done = true;
      optional.done = false;
      scope.$digest();
      expect(scope.verificationDisabled).toBe(false);
    });
    it('works even when steps are not given', function() {
      scope.report.steps = undefined;
      scope.$digest();
      expect(scope.verificationDisabled).toBe(false);
    });
  });
  describe('the status change handler', function(){
    beforeEach(function(){
      api.reports.def.getById
        .resolve(angular.copy(mocks.reports['538df48f9c616729ad000035']));
      scope.$digest();
      $window.alert = jasmine.createSpy('window alert');
      scope.report.steps = [{
        done: true
      }, {
        done: false
      }];
    });
    it('complains about changing from verified to unverified', function(){
      scope.report.status = reportStatuses('verified');
      scope.$digest();
      scope.report.status = reportStatuses('debunked');
      expect($window.alert).toHaveBeenCalled();
    });
    it('complains when marking as verified without doing the steps', function(){
      scope.report.status = reportStatuses('verified');
      scope.$digest();
      expect($window.alert).toHaveBeenCalled();
    });
    it('is happy when everything is regular', function(){
      scope.report.steps[1].done = true;
      scope.report.status = reportStatuses('verified');
      scope.$digest();
      expect($window.alert).not.toHaveBeenCalled();
    });
    it('has no problems when the steps are missing', function(){
      delete scope.report.steps;
      scope.report.status = reportStatuses('verified');
      scope.$digest();
    });
  });
});
