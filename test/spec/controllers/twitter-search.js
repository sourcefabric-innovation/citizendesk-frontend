'use strict';

describe('Controller: TwitterSearchCtrl', function () {

  // load the controller's module
  beforeEach(module('citizendeskFrontendApp'));

  var TwitterSearchCtrl,
      scope,
      returnedData = {
      },
      PageBroker = {
        load: function(){},
        getReturnedData: function(){}
      },
      TwitterSearches = {
        byId: function(){},
        start: function(){},
        refreshReport: function(){},
        delete: function(){}
      },
      $q,
      def = {
        PageBroker: {},
        TwitterSearches: {}
      },
      $location;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _$q_, _$location_) {
    $q = _$q_;

    def.TwitterSearches.byId = $q.defer();
    def.TwitterSearches.start = $q.defer();
    spyOn(TwitterSearches, 'byId').and.returnValue(def.TwitterSearches.byId.promise);
    spyOn(TwitterSearches, 'start')
      .and.returnValue(def.TwitterSearches.start.promise);
    spyOn(TwitterSearches, 'delete')
      .and.returnValue($q.when());
    
    spyOn(PageBroker, 'load');

    $location = _$location_;
    spyOn($location, 'url');

    scope = $rootScope.$new();
    TwitterSearchCtrl = $controller('TwitterSearchCtrl', {
      $scope: scope,
      $routeParams: {
        id: 'search id'
      },
      PageBroker: PageBroker,
      TwitterSearches: TwitterSearches,
      $location: $location
    });
  }));

  it('assigns', function() {
    var report = { _id: 'report id' }
    scope.assign(report);
    expect(PageBroker.load.calls.mostRecent().args).toEqual([
      '/assign/',
      { report: report }
    ]);
  });
  describe('after it got a search with reports', function(){
    beforeEach(function(){
      def.TwitterSearches.byId.resolve({
        _id: 'search id',
        reports: angular.copy(mocks.reports['list-not-paginated']._items)
      });
      spyOn(PageBroker, 'getReturnedData').and.returnValue({
        updateId: 'update id'
      });
      spyOn(TwitterSearches, 'refreshReport');
      scope.$digest();
    });
    it('checks the page broker', function(){
      expect(PageBroker.getReturnedData).toHaveBeenCalled();
    });
    it('asks for a report update', function(){
      expect(TwitterSearches.refreshReport.calls.mostRecent().args)
        .toEqual([ 'search id', 'update id' ]);
    });
    it('gets reports', function(){
      expect(scope.queue.reports.length).toBeGreaterThan(0);
    });
    it('calculates the linked text for every report', function(){
      expect(scope.queue.reports[0].linkedText).toBeDefined();
    });
    describe('deleting it', function() {
      beforeEach(function() {
        scope.delete();
        scope.$digest();
      });
      it('tells the user', function() {
        expect(scope.status).toBe('deleted');
      });
    });
  });
  describe('when the user is loading a deleted search', function() {
    beforeEach(function(){
      def.TwitterSearches.byId.resolve();
      scope.$digest();
    });
    it('leads her to an explanatory page', function() {
      expect($location.url).toHaveBeenCalled();
    });
  });
  it('has no problems if the page broker provides no data', inject(function($rootScope, $controller) {
    spyOn(PageBroker, 'getReturnedData').and.returnValue();
    spyOn(TwitterSearches, 'refreshReport');
    scope = $rootScope.$new();
    TwitterSearchCtrl = $controller('TwitterSearchCtrl', {
      $scope: scope,
      $routeParams: {
        id: 'search id'
      },
      PageBroker: PageBroker,
      TwitterSearches: TwitterSearches,
      $location: $location
    });
    def.TwitterSearches.byId.resolve({
      _id: 'search id',
      reports: []
    });
    scope.$digest();
    expect(TwitterSearches.refreshReport).not.toHaveBeenCalled();
  }));
});
