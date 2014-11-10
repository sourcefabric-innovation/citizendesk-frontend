'use strict';

describe('Controller: ConfigureCoveragesCtrl', function () {

  // load the controller's module
  beforeEach(module('citizendeskFrontendApp'));

  var ConfigureCoveragesCtrl,
      scope,
      $q,
      def = {},
      api = {
        coverages: {
          query: function(){},
          save: function(){},
          remove: function(){}
        }
      },
      coverages = {
        _items: [{
          _id: 1
        },{
          _id: 2
        }]
      },
      $modal = {};

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _$q_) {
    $q = _$q_;

    ['query', 'save', 'remove'].forEach(function(method) {
      def[method] = $q.defer();
      spyOn(api.coverages, method).and.returnValue(def[method].promise);
    });

    // costant function
    function c(result) { return function() { return result; }; }

    $modal.open = c({
      result: $q.when()
    });

    scope = $rootScope.$new();
    ConfigureCoveragesCtrl = $controller('ConfigureCoveragesCtrl', {
      $scope: scope,
      api: api,
      $modal: $modal
    });
    def.query.resolve(angular.copy(coverages));
    scope.$digest();
  }));

  it('adds coverages to the scope', function () {
    expect(scope.coverages.length).toBe(2);
  });
  it('saves a coverage', function(){
    scope.save(scope.coverages[0]);
    expect(scope.disabled).toBeTruthy();
    def.save.resolve();
    scope.$digest();
    expect(scope.disabled).toBeFalsy();
  });
  it('removes a coverage', function(){
    scope.remove(scope.coverages[0]);
    def.remove.resolve();
    scope.$digest();
    expect(scope.coverages.length).toBe(1);
  });
  it('adds a coverage', function(){
    scope.add();
    expect(scope.coverages.length).toBe(3);
  });
});
