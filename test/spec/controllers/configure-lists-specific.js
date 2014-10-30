'use strict';

describe('Controller: ConfigureListsSpecificCtrl', function () {

  // load the controller's module
  beforeEach(module('citizendeskFrontendApp'));

  var ConfigureListsSpecificCtrl,
      scope,
      PageBroker = {},
      def = {},
      $window = {
        location: {},
        history: {
          back: function(){}
        }
      },
      $q,
      $rootScope,
      api;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, _$rootScope_, _$q_, _api_) {
    $q = _$q_;
    $rootScope = _$rootScope_;
    api = _api_;
    def.getData = $q.defer();
    PageBroker.getData = function(){
      return def.getData.promise;
    };
    spyOn(PageBroker, 'getData').andCallThrough();
    $window.history.back = jasmine.createSpy('window back');

    scope = $rootScope.$new();
    ConfigureListsSpecificCtrl = $controller('ConfigureListsSpecificCtrl', {
      $scope: scope,
      $window: $window,
      PageBroker: PageBroker
    });
  }));

  it('checks the data', function () {
    expect(PageBroker.getData).toHaveBeenCalled();
  });
  it('defines some variations', function() {
    expect(scope.variations[0].class)
      .toEqual('label-default');
  });
  it('saves the list', function() {
    scope.save();
    expect(scope.disabled).toBe(true);
    api.citizen_lists.def.save.resolve();
    scope.$digest();
    expect(scope.disabled).toBe(false);
  });
  describe('when on a new list', function(){
    beforeEach(function(){
      def.getData.resolve('new');
      $rootScope.$digest();
    });
    it('sets the corresponding flag', function() {
      expect(scope.newList).toBeTruthy();
    });
    it('creates an empty list', function() {
      expect(scope.list).toEqual({
        variation: 'label-default'
      });
    });
  });
  describe('when editing an existing list', function(){
    beforeEach(function(){
      spyOn(api.citizen_aliases, 'query').andCallThrough();
      def.getData.resolve({
        _id: 'list id',
        name: 'list name'
      });
      $rootScope.$digest();
    });
    it('defines a list object', function(){
      expect(scope.list).toBeDefined();
    });
    it('looks for aliases associated with that list', function(){
      expect(api.citizen_aliases.query).toHaveBeenCalled();
    });
    describe('when there are associated aliases', function(){
      beforeEach(function(){
        api.citizen_aliases.def.query.resolve({
          _items: [{
            _id: 'alias id'
          }],
          _links: {}
        });
        scope.$digest();
      });
      it('attaches the aliases to the scope', function(){
        expect(scope.aliases).toBeDefined();
        expect(scope.aliases.length).not.toBe(0);
      });
    });
    describe('when there are not associated aliases', function(){
      beforeEach(function(){
        api.citizen_aliases.def.query.resolve({
          _items: [],
          _links: {}
        });
        scope.$digest();
      });
      it('is deletable', function(){
        expect(scope.deletable).toBeTruthy();
      });
      describe('when asked for deletion', function(){
        beforeEach(function(){
          api.citizen_aliases.reset.query();
          spyOn(api.citizen_aliases, 'query').andCallThrough();
          scope.delete();
        });
        // this is a way to reduce concurrency problem. while this
        // makes unlikely that an used list gets deleted, a small
        // probability of the event still remains
        it('checks again about associated aliases', function(){
          expect(api.citizen_aliases.query).toHaveBeenCalled();
        });
        describe('when associated aliases are found', function(){
          beforeEach(function(){
            $window.alert = jasmine.createSpy('window alert');
            api.citizen_aliases.def.query.resolve({
              _items: [{ _id: 'alias id' }],
              _links: {}
            });
            $rootScope.$digest();
          });
          it('prompts an alert and triggers a page back', function(){
            expect($window.alert).toHaveBeenCalled();
            expect($window.history.back).toHaveBeenCalled();
          });
        });
        describe('when associated aliases are not found', function(){
          beforeEach(function(){
            spyOn(api.citizen_lists, 'remove').andCallThrough();
            api.citizen_aliases.def.query.resolve({
              _items: [],
              _links: {}
            });
            $rootScope.$digest();
          });
          it('asks for actual deletion', function(){
            expect(api.citizen_lists.remove).toHaveBeenCalled();
          });
          describe('after actual deletion', function(){
            beforeEach(function(){
              PageBroker.back = jasmine.createSpy('page broker back');
              api.citizen_lists.def.remove.resolve();
              $rootScope.$digest();
            });
            it('goes back after success and asks for refresh', function(){
              expect($window.history.back).toHaveBeenCalled();
            });
          });
        });
      });
    });
  });
});
