'use strict';
/* jshint unused: false */

describe('Controller: ReportListCtrl', function () {

  // load the controller's module
  beforeEach(module('citizendeskFrontendApp'));

  var ReportListCtrl,
    scope,
  $httpBackend,
  $sails = {
    on: function() {},
    get: function() {
      return {
        success: function(f) {
          f([{
          },{
          },{
          }]);
        }
      };
    }
  };

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _$httpBackend_) {
    scope = $rootScope.$new();
    ReportListCtrl = $controller('ReportListCtrl', {
      $scope: scope,
      Reports: {
        reports: [{},{},{}],
        filters: {
          group: {
            reports: []
          }
        }
      },
      $routeParams: {
        group: 'group'
      }
    });
  }));

  it('should attach a list of reports to the scope', function () {
    expect(scope.reports.length).toBe(0);
  });
});
