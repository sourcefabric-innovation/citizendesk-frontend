'use strict';

describe('Controller: ConfigureTwitterIngestionFiltersCtrl', function () {

  // load the controller's module
  beforeEach(module('citizendeskFrontendApp'));

  var ConfigureTwitterIngestionFiltersCtrl,
  scope,
  SocketsHelpers = {
    save: function() {
      return {
        success: function() {},
        error: function() {}
      };
    }
  };

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ConfigureTwitterIngestionFiltersCtrl = $controller('ConfigureTwitterIngestionFiltersCtrl', {
      $scope: scope,
      $sails: globals.sails,
      SocketsHelpers: SocketsHelpers
    });
  }));

  it('should attach filters to the scope', function () {
    expect(scope.twtFilters.length).toBe(3);
  });
  it('can create a filter', function() {
    expect(scope.canAddFilter).toBe(true);
  });
  describe('new filter created', function() {
    beforeEach(function() {
      spyOn(SocketsHelpers, 'save').andCallThrough();
      scope.addFilter();
    });
    it('creates a new empty filter', function() {
      expect(scope.twtFilters.length).toBe(4);
      expect(scope.twtFilters[3].spec.track).toEqual([]);
    });
    xit('cannot create another new empty filter', function() {
      expect(scope.canAddFilter).toBe(false);
      scope.addFilter();
      expect(scope.twtFilters.length).toBe(4);
    });
    describe('new track added', function() {
      var newFilter;
      beforeEach(function() {
        newFilter = scope.twtFilters[3];
        scope.addTrack(newFilter);
      });
      it('adds a new empty track', function() {
        expect(newFilter.spec.track[0]).toBe('');
      });
      describe('new track specified', function() {
        beforeEach(function() {
          newFilter.spec.track[0] = 'test';
        });
        describe('saved', function() {
          beforeEach(function() {
            scope.saveFilter(newFilter);
          });
          it('sends the save request', function() {
            expect(SocketsHelpers.save).toHaveBeenCalled();
          });
          it('sends the right data', function() {
            expect(SocketsHelpers.save.mostRecentCall.args[0].spec.track[0])
              .toBe('test');
          });
        });
      });
    });
  });
});
