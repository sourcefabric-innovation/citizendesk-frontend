'use strict';

describe('Controller: ConfigureTwitterIngestionFiltersCtrl', function () {

  // load the controller's module
  beforeEach(module('citizendeskFrontendApp'));

  var ConfigureTwitterIngestionFiltersCtrl,
  scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ConfigureTwitterIngestionFiltersCtrl = $controller('ConfigureTwitterIngestionFiltersCtrl', {
      $scope: scope
    });
  }));

  xit('should attach filters to the scope', function () {
    expect(scope.twtFilters.length).toBe(3);
  });
  it('can create a filter', function() {
    expect(scope.canAddFilter).toBe(true);
  });
  describe('new filter created', function() {
    beforeEach(function() {
      scope.addFilter();
    });
    xit('creates a new empty filter', function() {
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
      xit('adds a new empty track', function() {
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
          // following was commented when removing sails
          xit('sends the save request', function() {
          });
          // following was commented when removing sails
          xit('sends the right data', function() {
          });
        });
      });
    });
  });
});
