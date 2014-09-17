'use strict';

describe('Controller: SelectMediaToPublishCtrl', function () {

  // load the controller's module
  beforeEach(module('citizendeskFrontendApp'));

  var SelectMediaToPublishCtrl,
      scope,
      api,
      $location = {
        url: function(){}
      },
      $window,
      def = {
        PageBroker: {}
      },
      PageBroker = {
        getData: function() { return def.PageBroker.getData.promise; }
      };

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _api_, _$window_, $q, _$location_) {
    api = _api_;
    spyOn(api.reports, 'getById').andCallThrough();
    spyOn(api.reports, 'save').andCallThrough();
    $window = _$window_;
    spyOn($window.history, 'back');
    def.PageBroker.getData = $q.defer();
    spyOn(PageBroker, 'getData').andCallThrough();
    $location = _$location_;
    spyOn($location, 'url');
    
    scope = $rootScope.$new();
    SelectMediaToPublishCtrl = $controller('SelectMediaToPublishCtrl', {
      $scope: scope,
      $routeParams: {
        type: 'web_link',
        id: 'abcdef'
      },
      PageBroker: PageBroker,
      $location: $location
    });
  }));

  it('cancels', function () {
    scope.cancel();
    expect($window.history.back).toHaveBeenCalled();
  });
  it('asks for the report', function() {
    expect(PageBroker.getData).toHaveBeenCalledWith('/report-web_link/abcdef');
  });
  describe('gets the report', function() {
    beforeEach(function() {
      def.PageBroker.getData
        .resolve(angular.copy(mocks.reports['5418128a9c616745002376bb']));
      scope.$digest();
    });
    it('sends the images reordered on submit', function() {
      scope.selected = 1;
      scope.submit();
      expect(api.reports.save).toHaveBeenCalled();
      var report = api.reports.save.mostRecentCall.args[0];
      expect(report.media[0].link).toBe('http://second-image-link.png');
      api.reports.def.save.resolve('');
      scope.$digest();
      expect($location.url).toHaveBeenCalledWith('/report-web_link/abcdef');
    });
  });
});
