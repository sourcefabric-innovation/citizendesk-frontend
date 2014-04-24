'use strict';

describe('Service: SocketsHelpers', function () {

  // load the service's module
  beforeEach(module('citizendeskFrontendApp'));

  // instantiate service
  var SocketsHelpers;
  beforeEach(inject(function (_SocketsHelpers_) {
    SocketsHelpers = _SocketsHelpers_;
    SocketsHelpers.$sails = globals.sails;
    spyOn(globals.sails, 'post').andCallThrough();
    spyOn(globals.sails, 'put').andCallThrough();
  }));

  describe('the save function', function() {
    it('posts an object without id', function () {
      SocketsHelpers.save({any: 'object'}, '/endpoint/');
      expect(globals.sails.post).toHaveBeenCalled();
    });
    it('saves the id of a newly posted object', function () {
      var o = {};
      SocketsHelpers.save(o, '/endpoint/');
      expect(o.id).toBe('abcabcabc');
    });
    it('puts an object with id', function () {
      SocketsHelpers.save({any: 'object', id: 5}, '/endpoint/');
      expect(globals.sails.put).toHaveBeenCalled();
    });
  });

});
