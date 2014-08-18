'use strict';

describe('Controller: AssignedToMeCtrl', function () {

  // load the controller's module
  beforeEach(module('citizendeskFrontendApp'));

  var AssignedToMeCtrl,
      scope,
      $q,
      api = {
        reports: {
          query: function() {
            return $q.when(angular.copy(mocks.reports['list-not-paginated']));
          }
        }
      };

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _$q_) {
    $q = _$q_;
    scope = $rootScope.$new();
    spyOn(api.reports, 'query').andCallThrough();
    AssignedToMeCtrl = $controller('AssignedToMeCtrl', {
      $scope: scope,
      api: api,
      session: {
        identity: mocks.auth.success
      }
    });
    scope.$digest();
  }));

  it('queries for the assigned reports list', function() {
    var query = api.reports.query.mostRecentCall.args[0];
    expect(query.page).toBe(1);
    expect(query.sort).toBe('[("produced", -1)]');
  });
  it('attaches reports to the scope', function () {
    expect(scope.reports.length).toBe(1);
  });
  it('builds the linked text for every report', function(){
    expect(scope.reports[0].linkedText).toBeDefined();
  });
});
