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
    spyOn(PageBroker, 'getData').and.callThrough();
    spyOn(api.citizen_lists, 'query').and.callThrough();
    $window.history.back = jasmine.createSpy('window history back');
    AliasesInLists.update = jasmine.createSpy('aliases in lists update');

    scope = $rootScope.$new();
    EditUserListsCtrl = $controller('EditUserListsCtrl', {
      $scope: scope,
      PageBroker: PageBroker,
      $window: $window,
      AliasesInLists: AliasesInLists
    });
  }));
  describe('users without an associated identity record', function() {
    beforeEach(function(){
      def.getData.resolve({
        _id: 'alias id',
        identity_record_id: undefined,
        tags: []
      });
      scope.$digest();
    });
    it('can save', function(){
      spyOn(api.citizen_aliases, 'save').and.callThrough();
      scope.save();
      expect(api.citizen_aliases.save)
        .toHaveBeenCalledWith({
          _id : 'alias id',
          identity_record_id: undefined,
          tags : []
        });
      expect(scope.disabled).toBeTruthy();
      api.citizen_aliases.def.save.resolve();
      scope.$digest();
      expect($window.history.back).toHaveBeenCalled();
      expect(AliasesInLists.update).toHaveBeenCalled();
    });
  });
  describe('users not belonging to any list', function() {
    beforeEach(function(){
      def.getData.resolve({
        _id: 'alias id',
        identity_record_id: {
          _id: 'identity record id',
          first_name: 'Franco',
          last_name: 'Occhi'
        },
        tags: []
      });
      scope.$digest();
    });
    it('is understood', function() {
      expect(scope.currentList).toBe(false);
    });
    it('can save', function(){
      spyOn(api.citizen_aliases, 'save').and.callThrough();
      scope.save();
      expect(api.citizen_aliases.save)
        .toHaveBeenCalledWith({
          _id : 'alias id',
          identity_record_id: 'identity record id',
          tags : []
        });
      expect(scope.disabled).toBeTruthy();
      api.citizen_aliases.def.save.resolve();
      scope.$digest();
      expect($window.history.back).toHaveBeenCalled();
      expect(AliasesInLists.update).toHaveBeenCalled();
    });
  });
  describe('when the user already belongs to a list', function() {
    beforeEach(function() {
      def.getData.resolve({
        _id: 'alias id',
        identity_record_id: {
          _id: 'identity record id',
          first_name: 'Franco',
          last_name: 'Occhi'
        },
        tags: [{ _id: 'list id' }]
      });
    });
    describe('with lists', function() {
      beforeEach(function() {
        api.citizen_lists.def.query.resolve({
          _items: [{ _id: 'the first list'}, {}, {}],
          _links: {}
        });
        scope.$digest();
      });
      it('adds the lists to the scope', function() {
        expect(scope.lists.length).toBe(3);
      });
      it('saves when setting a list', function(){
        spyOn(api.citizen_aliases, 'save').and.callThrough();
        scope.currentList = scope.lists[0];
        scope.save();
        expect(api.citizen_aliases.save)
          .toHaveBeenCalledWith({
            _id : 'alias id',
            identity_record_id: 'identity record id',
            tags : [{
              _id: 'the first list'
            }]
          });
        expect(scope.disabled).toBeTruthy();
        api.citizen_aliases.def.save.resolve();
        scope.$digest();
        expect($window.history.back).toHaveBeenCalled();
        expect(AliasesInLists.update).toHaveBeenCalled();
      });
    });
    describe('without lists', function() {
      beforeEach(function() {
        api.citizen_lists.def.query.resolve({
          _items: [],
          _links: {}
        });
        scope.$digest();
      });
      it('tells the user that we have no lists', function() {
        expect(scope.noLists).toBeTruthy();
      });
      it('asks for all the lists', function () {
        expect(api.citizen_lists.query).toHaveBeenCalled();
      });
      it('stores the alias in the scope', function(){
        expect(scope.alias._id).toBe('alias id');
      });
      it('saves just the id', function(){
        spyOn(api.citizen_aliases, 'save').and.callThrough();
        scope.save();
        expect(api.citizen_aliases.save)
          .toHaveBeenCalledWith({
            _id : 'alias id',
            identity_record_id: 'identity record id',
            tags : ['list id']
          });
        expect(scope.disabled).toBeTruthy();
        api.citizen_aliases.def.save.resolve();
        scope.$digest();
        expect($window.history.back).toHaveBeenCalled();
        expect(AliasesInLists.update).toHaveBeenCalled();
      });
    });
  });
});
