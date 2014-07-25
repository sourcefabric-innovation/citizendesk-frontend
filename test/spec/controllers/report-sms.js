'use strict';

describe('Controller: ReportCtrl', function () {

  // load the controller's module
  beforeEach(module('citizendeskFrontendApp'));

  var ReportCtrl,
      scope,
      $httpBackend,
      Report = {},
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
      $q;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _$httpBackend_, _$q_) {
    $q = _$q_;
    scope = $rootScope.$new();
    dependencies.$scope = scope;
    ReportCtrl = $controller('ReportSmsCtrl', dependencies);
    $httpBackend = _$httpBackend_;
    $httpBackend
      .expectGET(globals.root)
      .respond(mocks.root);
    $httpBackend
      .expectGET(globals.root + 'reports/abcdef')
      .respond(angular.copy(mocks.reports['538df48f9c616729ad000035']));
    $httpBackend
      .expectGET(globals.root + 'steps')
      .respond(mocks.steps.list);
    $httpBackend.flush();
  }));

  it('has the correct link to the endpoint', function() {
    expect(scope.report._links.self.href).toBe('http://cd2.sourcefabric.net/citizendesk-interface/reports/53ba73019c6167462300068b');
  });
  it('attaches a report to the scope', function () {
    expect(scope.report).toBeDefined();
  });
  it('disables report verification', function() {
    scope.$apply();
    expect(scope.wait).toBe(true);
  });
  describe('after all steps are done', function() {
    beforeEach(function() {
      scope.report.steps.forEach(function(step) {
        step.done = true;
      });
      scope.$apply();
    });
    it('enables report verification', function() {
      expect(scope.wait).toBe(false);
    });
  });
  describe('starting with existent steps', function() {
    beforeEach(inject(function ($controller, $rootScope) {
      scope = $rootScope.$new();
      dependencies.$scope = scope;
      ReportCtrl = $controller('ReportSmsCtrl', dependencies);
      $httpBackend
        .expectGET(globals.root + 'reports/abcdef')
        .respond(mocks.reports['538df48f9c616729ad000035']);
      $httpBackend
        .expectGET(globals.root + 'steps')
        .respond(mocks.steps.list);
      $httpBackend.flush();
    }));
    it('disables report verification', function() {
      scope.$apply();
      expect(scope.wait).toBe(true);
    });
    describe('after all steps are done', function() {
      beforeEach(function() {
        scope.report.steps.forEach(function(step) {
          step.done = true;
        });
        scope.$apply();
      });
      it('enables report verification', function() {
        expect(scope.wait).toBe(false);
      });
    });
  });
  describe('when starting a transcript', function() {
    beforeEach(function() {
      scope.startTranscript();
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
        scope.transcriptCandidate = 'edited';
        var response = angular.copy(scope.report);
        response.texts[0].transcript = 'edited';
        $httpBackend
          .expect('PATCH', 'http://cd2.sourcefabric.net/citizendesk-interface/reports/53ba73019c6167462300068b')
          .respond(response);
        scope.saveTranscript();
        scope.$digest();
      });
      it('disables the input', function() {
        expect(scope.disableTranscript).toBe(true);
      });
      describe('when saved', function() {
        beforeEach(function() {
          $httpBackend.flush();
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
        afterEach(function() {
          $httpBackend.verifyNoOutstandingRequest();
          $httpBackend.verifyNoOutstandingExpectation();
        });
      });
    });
  });
  it('deletes a summary', function(){
    def.reports.remove = $q.defer();
    spyOn(scope.api.reports, 'remove')
      .andReturn(def.reports.remove.promise);
    spyOn($window.history, 'back');
    scope.deleteSummary();
    expect(scope.api.reports.remove).toHaveBeenCalled();
    expect(scope.deleteSummaryDisabled).toBe(true);
    def.reports.remove.resolve({});
    scope.$digest();
    expect($window.history.back).toHaveBeenCalled();
  });
});
