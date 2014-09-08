var globals = {
  root: 'https://cd2.sourcefabric.net/citizendesk-interface/',
  // all controllers sharing the `simple-report-list.html` template
  // have to implement the same interface
  simpleListControllerTest: function(name) {
    var SimpleReportList = {};
    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
      SimpleReportList.init = jasmine.createSpy('service init');

      scope = $rootScope.$new();
      DebunkedListCtrl = $controller(name, {
        $scope: scope,
        SimpleReportList: SimpleReportList
      });
    }));

    it('initialises the service', function () {
      expect(SimpleReportList.init).toHaveBeenCalled();
    });
  }
};
