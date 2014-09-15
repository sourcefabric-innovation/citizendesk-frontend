'use strict';

describe('Directive: scrollTarget', function () {

  // load the directive's module
  beforeEach(module('citizendeskFrontendApp'));

  var element,
      scope,
      ScrollTo,
      $document;

  beforeEach(inject(function ($rootScope, _ScrollTo_, _$document_) {
    scope = $rootScope.$new();
    ScrollTo = _ScrollTo_;
    $document = _$document_;
    spyOn($document, 'scrollTo');
  }));

  describe('once compiled', function() {
    var element;
    beforeEach(inject(function($compile) {
      element = angular.element('<div scroll-target="\'a\'"></div>');
      element = $compile(element)(scope);
    }));
    it('gets the target argument right', function () {
      expect(element.isolateScope().scrollTarget).toEqual('a');
    });
    describe('after the service scrolls to a target', function() {
      beforeEach(function() {
        ScrollTo.targetStream.push('a');
      });
      it('scrolls to the element if it matches', function () {
        expect($document.scrollTo).toHaveBeenCalled();
      });
    });
  });
  describe('after the service scrolls to a target', function() {
    beforeEach(function() {
      ScrollTo.targetStream.push('a');
    });
    it('scrolls to the element if it matches', inject(function ($compile) {
      element = angular.element('<div scroll-target="\'a\'"></div>');
      element = $compile(element)(scope);
      expect($document.scrollTo).toHaveBeenCalled();
    }));
    it('ignores the event if it does not match', inject(function ($compile) {
      element = angular.element('<div scroll-target="\'b\'"></div>');
      element = $compile(element)(scope);
      expect($document.scrollTo).not.toHaveBeenCalled();
    }));
  });
});
