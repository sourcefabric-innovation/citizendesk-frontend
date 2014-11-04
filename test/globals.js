var globals = {
  root: 'https://cd2.sourcefabric.net/citizendesk-interface/',
  // all controllers sharing the `simple-report-list.html` template
  // have to implement the same interface
  simpleListControllerTest: function(name, $routeParams) {
    var SimpleReportList = {
      init: function() { return {then: function(){}}; }
    };
    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
      spyOn(SimpleReportList, 'init').and.callThrough();

      scope = $rootScope.$new();
      DebunkedListCtrl = $controller(name, {
        $scope: scope,
        SimpleReportList: SimpleReportList,
        $routeParams: $routeParams
      });
    }));

    it('initialises the service', function () {
      expect(SimpleReportList.init).toHaveBeenCalled();
    });
  }
};
