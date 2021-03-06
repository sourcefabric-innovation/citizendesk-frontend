'use strict';

/* this service caches the aliases associated to lists. it is useful
in order to link reports with lists */

describe('Service: AliasesInLists', function () {

  // load the service's module
  beforeEach(module('citizendeskFrontendApp'));

  // instantiate service
  var AliasesInLists,
      api,
      $rootScope;

  beforeEach(inject(function (_api_){
    api = _api_;
    spyOn(api.citizen_aliases, 'query').and.callThrough();
  }));
  beforeEach(inject(function (_AliasesInLists_, _$rootScope_) {
    AliasesInLists = _AliasesInLists_;
    $rootScope = _$rootScope_;
  }));

  it('requires the aliases', function () {
    expect(api.citizen_aliases.query.calls.count()).toBe(1);
  });
  describe('after reply', function(){
    var alias;
    beforeEach(function() {
      api.citizen_aliases.def.query.resolve({
        _items: [{
          authority: 'authority',
          identifiers: {
            user_name: 'id'
          }
        }]
      });
      $rootScope.$digest();
    });
    it('can get an alias by authority and id', function(){
      AliasesInLists.indexPromise.then(function(index) {
        alias = index.authority.id;
      });
      $rootScope.$digest();
      expect(alias).toEqual({
        authority: 'authority',
        identifiers: {
          user_name: 'id'
        }
      });
    });
    it('embeds an alias in a well formed report', function(){
      var report = {
        authors: [{
          authority: 'authority',
          identifiers: {
            user_name: 'id'
          }
        }]
      };
      AliasesInLists.embedAuthorAlias(report);
      $rootScope.$digest();
      expect(report.authors[0].alias).toBeDefined();
    });
    it('ignores alias embedding when identifiers are missing', function() {
      var report = {
        authors: [{}]
      };
      expect(function() {
        AliasesInLists.embedAuthorAlias(report);
        $rootScope.$digest();
      }).not.toThrow();
    });
    it('ignores alias embedding when the id is missing', function() {
      var report = {
        authors: [{
          authority: 'authority',
          identifiers: {
            user_name: 'missing id'
          }
        }]
      };
      AliasesInLists.embedAuthorAlias(report);
      $rootScope.$digest();
      expect(report.authors[0].alias).not.toBeDefined();
    });
    describe('after an update request', function(){
      // update requests will be needed, for example, after adding an
      // alias to a citizen list
      beforeEach(function(){
        AliasesInLists.update();
      });
      it('requires the aliases again', function(){
        expect(api.citizen_aliases.query.calls.count()).toBe(2);
      });
    });
  });

});
