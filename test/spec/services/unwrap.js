'use strict';
/* jshint indent: false */
/* jshint quotmark: false */
/* jshint camelcase: false */

/*

 `unwrap` is a transform function for the $httpProvider, this is why
 it is defined as a constant. it unwraps the internal array returned
 by a collection query, and assigns the `_links` property to it. This
 is possible in javascript. This way, the array can be iterated and
 used easily, and it is compatible with `$resource.query`, while its
 HATEOAS still remain accessible

 */

describe('Service: Unwrap', function () {

  var response = {
    _items: [{
        bla: 'bla',
      }, {
        bla: 'bla',
      }],
    _links: {
      self: {
        href: "/reports",
        title: "reports"
      },
      last: {
        href: "/reports?max_results=2&page=206366",
        title: "last page"
      },
      parent: {
        href: "",
        title: "home"
      },
      next: {
        href: "/reports?max_results=2&page=2",
        title: "next page"
      }
    }
  };

  // load the service's module
  beforeEach(module('citizendeskFrontendApp'));

  // instantiate service
  var unwrap;
  beforeEach(inject(function (_unwrap_) {
    unwrap = _unwrap_;
  }));

  it('transforms an item response', function () {
    var transformed = unwrap(response);
    expect(transformed._links).toBeDefined();
    expect(angular.isArray(transformed)).toBe(true);
  });

  describe('when a resource is queried', function() {
    var result;
    beforeEach(inject(function($resource, prefix, $httpBackend) {
      $httpBackend
        .expectGET(prefix + '/twt_filters')
        .respond(mocks.twt_filters.list);
      result = $resource(prefix + '/twt_filters').query();
      $httpBackend.flush();
    }));
    it('gets applied to the query result', function() {
      expect(angular.isArray(result)).toBe(true);
      expect(result.length).toBe(4);
      expect(result[0]._id).toBe('5358e4249611f4a65e3068ab');
    });
  });
});
