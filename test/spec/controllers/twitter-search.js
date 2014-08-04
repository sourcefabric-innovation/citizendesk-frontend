'use strict';

describe('Controller: TwitterSearchCtrl', function () {

  // load the controller's module
  beforeEach(module('citizendeskFrontendApp'));

  var TwitterSearchCtrl,
      scope,
      PageBroker = {
        load: function(){},
        getReturnedData: function(){}
      },
      TwitterSearches = {
        byId: function(){},
        start: function(){},
        refreshReport: function(){}
      },
      $q,
      def = {
        PageBroker: {},
        TwitterSearches: {}
      };

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _$q_) {
    $q = _$q_;
    scope = $rootScope.$new();

    def.TwitterSearches.byId = $q.defer();
    def.TwitterSearches.start = $q.defer();
    spyOn(TwitterSearches, 'byId').andReturn(def.TwitterSearches.byId.promise);
    spyOn(TwitterSearches, 'start')
      .andReturn(def.TwitterSearches.start.promise);
    
    spyOn(PageBroker, 'load');
    TwitterSearchCtrl = $controller('TwitterSearchCtrl', {
      $scope: scope,
      $routeParams: {
        id: 'search id'
      },
      PageBroker: PageBroker,
      TwitterSearches: TwitterSearches
    });
  }));

  it('attaches a queue to the scope', function () {
    expect(scope.queue).toBeDefined();
  });
  it('assigns', function() {
    var report = { _id: 'report id' }
    scope.assign(report);
    expect(PageBroker.load.mostRecentCall.args).toEqual([
      '/assign/',
      { report: report }
    ]);
  });
  describe('after it got the search', function(){
    beforeEach(function(){
      def.TwitterSearches.byId.resolve({
        _id: 'search id'
      });
      spyOn(PageBroker, 'getReturnedData').andReturn({
        updateId: 'update id'
      });
      spyOn(TwitterSearches, 'refreshReport');
      scope.$digest();
    });
    it('checks the page broker', function(){
      expect(PageBroker.getReturnedData).toHaveBeenCalled();
    });
    it('asks for a report update', function(){
      expect(TwitterSearches.refreshReport.mostRecentCall.args)
        .toEqual([ 'search id', 'update id' ]);
    });
    it('asks to start the search', function(){
      expect(TwitterSearches.start).toHaveBeenCalled();
    });
  });
});
