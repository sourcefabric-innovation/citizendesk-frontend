/*
 * these services are so pervasive, that i have to disable them once
 * for all in order to avoid affecting all the tests */
angular.module('citizendeskFrontendApp')
  .config(function(cacheBusterProvider, RavenProvider, authProvider) {
    [
      cacheBusterProvider,
      RavenProvider,
      authProvider
    ].forEach(function(provider) {
      provider.disabled = true;
    });
  });
