'use strict';

// this public service will identify well known, recidivous errors to
// provide the response they deserve, all in the interest of citizens
// user experience, of course

// this service will return keys corresponding to the type of errors,
// to be used with ngMessages. if you want, you can create a reusable
// template for messages in order to be sure that you are always
// covering the errors detected here. check the documentation of
// ngMessages about this

angular.module('citizendeskFrontendApp')
  .service('ErrorPolice', function ErrorPolice(lodash, safeAccess) {
    var service = this;
    // an error might match more than one identifier, corresponding to
    // more messages we want to show to the user
    this.identifiers = {
      shortPassword: function(rejection) {
        var s = rejection.status === 422,
            l = safeAccess(rejection, 'data._issues.password.minlength');
        return s && l;
      },
      authenticationFailure: function(rej) {
        return Boolean(safeAccess(rej, 'data._issues.credentials'));
      }
    };
    // `rejection` here is supposed to be the rejection parameter in
    // the `responseError` interceptor, so set a breakpoint there in
    // order to find out how the fingerprint for your error looks like
    // (and add it to the tests afterwards)
    this.identify = function(rejection) {
      var matches = [];
      lodash.forEach(service.identifiers, function(predicate, key) {
        if (predicate(rejection)) {
          matches.push(key);
        }
      });
      return matches;
    };
  });
