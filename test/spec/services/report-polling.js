'use strict';
/* jshint indent: false */

/*

 Polling service for reports, allows several listener callbacks to be
 attached to a 'create' event so that they are called with every newly
 created report received from the server.

 The polling is based on the modification timestamps on the
 reports. If the time interval we require overlap, we may receive
 duplicate reports also for the creation event. On the other end, if
 some time interval is not covered, we may miss the creation of some
 report. I prefer to get duplicates and add a duplication check.

 The format used by Eve for queries is "GMT string", like in the
 `toGMTString` method of javascript date objects. This has a precision
 of seconds, which makes duplicate check even more opportune.

 In order to avoid synchronisation problems between the client and the
 server clock, a client side generated timestamp is used just for the
 first request. Afterward, the last timestamp on a report received by
 the server is used for the following requests

 */

describe('Service: ReportPolling', function () {

  // load the service's module
  beforeEach(module('citizendeskFrontendApp'));

  // instantiate service
  var ReportPolling,
      prefix;
  beforeEach(inject(function (_ReportPolling_, config) {
    ReportPolling = _ReportPolling_;
    ReportPolling.lastDate = (new Date(1401212090951)).toGMTString();
    prefix = config.server.url;
  }));

  describe('with a create listener', function () {
    var listener;
    beforeEach(function() {
      listener = jasmine.createSpy('listener');
      ReportPolling.onCreate(listener);
    });
    it('calls the listener if resources are created',
       inject(function($httpBackend, $timeout) {
         $httpBackend
           .expectGET(prefix + '/reports?sort=%5B(%22produced%22,+-1)%5D&where=%7B%22produced%22:%7B%22$gt%22:%22Tue,+27+May+2014+17:34:50+GMT%22%7D%7D')
           .respond([{
             _id: 1,
             produced: 'Tue, 03 Jun 2014 10:29:38 GMT'
           }, {
             _id: 2
           }, {
             _id: 3
           }]);
         $httpBackend.flush();
         expect(ReportPolling.lastDate).toBe('Tue, 03 Jun 2014 10:29:38 GMT');
         expect(listener.calls.length).toBe(3);
       }));
    it('does not call the listener if resources are not created',
       inject(function($httpBackend, $timeout) {
         $httpBackend
           .expectGET(prefix + '/reports?sort=%5B(%22produced%22,+-1)%5D&where=%7B%22produced%22:%7B%22$gt%22:%22Tue,+27+May+2014+17:34:50+GMT%22%7D%7D')
           .respond([]);
         $httpBackend.flush();
         expect(listener.calls.length).toBe(0);
       }));
  });

});
