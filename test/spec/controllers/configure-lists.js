'use strict';

describe('Controller: ConfigureListsCtrl', function () {

  // load the controller's module
  beforeEach(module('citizendeskFrontendApp'));

  var ConfigureListsCtrl,
      scope,
      PageBroker = {},
      api;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _api_) {
    api = _api_;
    spyOn(api.citizen_lists, 'query').andCallThrough();
    PageBroker.load = jasmine.createSpy('page broker load');

    scope = $rootScope.$new();
    ConfigureListsCtrl = $controller('ConfigureListsCtrl', {
      $scope: scope,
      PageBroker: PageBroker
    });
  }));

  it('fetches the lists', function () {
    expect(api.citizen_lists.query).toHaveBeenCalled();
    api.citizen_lists.def.query.resolve({
      _items: [{}, {}, {}],
      _links: {}
    });
    scope.$digest();
    expect(scope.lists.length).toBe(3);
  });
  it('brings the user to the specific edit page', function(){
    var list = { _id: 'list id'};
    scope.edit(list);
    expect(PageBroker.load).toHaveBeenCalled();
  });
  it('brings the user to the page for creating a new list', function(){
    scope.create();
    expect(PageBroker.load)
      .toHaveBeenCalledWith('/configure-lists-specific', 'new');
  });
});
