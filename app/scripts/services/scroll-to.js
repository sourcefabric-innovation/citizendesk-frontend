'use strict';

angular.module('citizendeskFrontendApp')
  .service('ScrollTo', function ScrollTo(Bacon) {
    var service = this;
    this.targetStream = new Bacon.Bus();
    this.target = this.targetStream.toProperty();
    // empty listener necessary in order to have the property updated
    // to the last value even before any listener was attached to the
    // property yet. without this, tests should fail. check also
    // https://github.com/baconjs/bacon.js/wiki/FAQ#how-do-i-get-the-latest-value-of-a-property
    this.target.onValue(function(){});
  });
