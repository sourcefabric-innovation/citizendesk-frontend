'use strict';

describe('Controller: EditUserListsCtrl', function () {

  // load the controller's module
  beforeEach(module('citizendeskFrontendApp'));

  var EditUserListsCtrl,
      scope,
      $q,
      api,
      PageBroker = {
      },
      def = {},
      $window = {
        history: {}
      },
      AliasesInLists = {};

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _$q_, _api_) {
    $q = _$q_;
    api = _api_;
    def.getData = $q.defer();
    PageBroker.getData = function() { return def.getData.promise; };
    spyOn(PageBroker, 'getData').andCallThrough();
    spyOn(api.citizen_lists, 'query').andCallThrough();
    $window.history.back = jasmine.createSpy('window history back');
    AliasesInLists.update = jasmine.createSpy('aliases in lists update');

    scope = $rootScope.$new();
    EditUserListsCtrl = $controller('EditUserListsCtrl', {
      $scope: scope,
      PageBroker: PageBroker,
      $window: $window,
      AliasesInLists: AliasesInLists
    });

    def.getData.resolve({
      _id: 'alias id',
      tags: []
    });
    api.citizen_lists.def.query.resolve({
      _items: [],
      _links: {}
    });
    scope.$digest();
  }));

  it('asks for all the lists', function () {
    expect(api.citizen_lists.query).toHaveBeenCalled();
  });
  it('stores the alias in the scope', function(){
    expect(scope.alias._id).toBe('alias id');
  });
  it('saves the citizen', function(){
    spyOn(api.citizen_aliases, 'save').andCallThrough();
    scope.save();
    expect(api.citizen_aliases.save)
      .toHaveBeenCalledWith({ _id : 'alias id', tags : [  ] });
    expect(scope.disabled).toBeTruthy();
    api.citizen_aliases.def.save.resolve();
    scope.$digest();
    expect($window.history.back).toHaveBeenCalled();
    expect(AliasesInLists.update).toHaveBeenCalled();
  });
});
