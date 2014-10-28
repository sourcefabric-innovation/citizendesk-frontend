'use strict';

describe('Controller: ReportSmsCtrl', function () {

  // load the controller's module
  beforeEach(module('citizendeskFrontendApp'));

  var ReportCtrl,
      scope,
      $httpBackend,
      Report = {
        getSelectedCoverage: function(){},
        checkPublished: function(){},
        getVerificationHandler: function(){ return function(){}; },
        addSteps: function(){},
        getStepsHandler: function(){ return function(){}; }
      },
      Coverages = { promise: { then: function(){} } },
      $window = {
        history: {
          back: function(){}
        }
      },
      dependencies = {
        $routeParams: {id: 'abcdef'},
        Report: Report,
        Coverages: Coverages,
        $window: $window
      },
      def = {
        reports: {}
      },
      $q,
      api;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _$httpBackend_, _$q_, _api_) {
    $q = _$q_;
    api = _api_;
    scope = $rootScope.$new();
    dependencies.$scope = scope;
    spyOn(api.reports, 'getById').andCallThrough();
    spyOn(api.steps, 'query').andCallThrough();
    spyOn(Report, 'getVerificationHandler').andCallThrough();
    ReportCtrl = $controller('ReportSmsCtrl', dependencies);
    $httpBackend = _$httpBackend_;
  }));
  describe('starting from something already transcripted', function() {
    beforeEach(function() {
      var report = angular.copy(mocks.reports['538df48f9c616729ad000035']);
      report.texts[0].transcript = 'somebody rephrased this';
      api.reports.def.getById.resolve(report);
      api.steps.def.query.resolve(mocks.steps.list);
      scope.$digest();
    });
    it('edits the transcript starting from the existing one', function() {
      scope.startTranscript();
      expect(scope.transcriptCandidate)
        .toEqual(scope.report.texts[0].transcript);
    });
  });
  describe('starting from something not transcripted', function() {
    beforeEach(function() {
      api.reports.def.getById
        .resolve(angular.copy(mocks.reports['538df48f9c616729ad000035']));
      api.steps.def.query.resolve(mocks.steps.list);
      scope.$digest();
    });
    it('has the correct link to the endpoint', function() {
      expect(scope.report._links.self.href).toBe('http://cd2.sourcefabric.net/citizendesk-interface/reports/53ba73019c6167462300068b');
    });
    describe('when starting a transcript', function() {
      beforeEach(function() {
        scope.startTranscript();
      });
      it('starts from the original', function() {
        expect(scope.transcriptCandidate)
          .toEqual(scope.report.texts[0].original);
      });
      it('enables the buttons', function() {
        expect(scope.disableTranscript).toBeFalsy();
      });
      it('has a transcript candidate', function() {
        expect(scope.transcriptCandidate).toBeTruthy();
      });
      it('is editing a transcript', function() {
        expect(scope.editingTranscript).toBe(true);
      });
      it('copies the original content', function() {
        expect(scope.transcriptCandidate).toBe('#Mozambique Council of State is discussing the military conflict that has killed dozens &amp; forced many to flee central district of #Muxungue');
      });
      describe('when discarding', function() {
        beforeEach(function() {
          scope.cancelTranscriptEditing();
        });
        it('is not editing a transcript', function() {
          expect(scope.editingTranscript).toBe(false);
        });
      });
      describe('when saving', function() {
        beforeEach(function() {
          spyOn(api.reports, 'update').andCallThrough();
          scope.transcriptCandidate = 'edited';
          scope.saveTranscript();
        });
        it('asks to update', function(){
          expect(api.reports.update).toHaveBeenCalled();
        });
        it('disables the input', function() {
          expect(scope.disableTranscript).toBe(true);
        });
        describe('when saved', function() {
          beforeEach(function() {
            var response = angular.copy(scope.report);
            response.texts[0].transcript = 'edited';
            api.reports.def.update.resolve(response);
            scope.$digest();
          });
          it('updates the model', function() {
            expect(scope.report.texts[0].transcript).toBe('edited');
          });
          it('enables the buttons', function() {
            expect(scope.disableTranscript).toBe(false);
          });
          it('has a transcript', function() {
            expect(scope.hasTranscript).toBeTruthy();
          });
          it('is not editing a transcript', function() {
            expect(scope.editingTranscript).toBe(false);
          });
          it('can discard the transcript', function() {
            api.reports.reset.update();
            spyOn(api.reports, 'update').andCallThrough();
            scope.discardTranscript();
            var report = angular.copy(api.reports.update.mostRecentCall.args[0]),
                patch  = angular.copy(api.reports.update.mostRecentCall.args[1]),
                updated = angular.extend(report, patch);
            expect(updated.texts[0].transcript).not.toBeDefined();
            expect(api.reports.update).toHaveBeenCalled();
            api.reports.def.update.resolve(updated);
            scope.$digest();
            expect(scope.report.texts[0].transcript).not.toBeDefined();
            expect(scope.hasTranscript).toBe(false);
          });
          afterEach(function() {
            $httpBackend.verifyNoOutstandingRequest();
            $httpBackend.verifyNoOutstandingExpectation();
          });
        });
      });
    });
  });
  it('deletes a summary', function(){
    def.reports.remove = $q.defer();
    spyOn(api.reports, 'remove')
      .andReturn(def.reports.remove.promise);
    spyOn($window.history, 'back');
    scope.deleteSummary();
    expect(api.reports.remove).toHaveBeenCalled();
    expect(scope.deleteSummaryDisabled).toBe(true);
    def.reports.remove.resolve({});
    scope.$digest();
    expect($window.history.back).toHaveBeenCalled();
  });
});
