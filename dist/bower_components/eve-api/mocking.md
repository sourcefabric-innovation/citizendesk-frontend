# Mocking utilities

This module provides also its own mock, in a separate file, in order
to be used for unit tests. Using a mock that is at an higer level than
`$http` will make your tests more readable and easier to maintain.

In order to use the mock, include the mocked file
`dist/eve-api-mock.js` in your karma configuration, instead of
including the regular module.

This way, your API configuration will be read and a mocked `api`
service will be created, in order to be used in unit tests.

Let's say that you have an Eve entity called `documents`, a mocked
endpoint will be created on `api`, with all the methods that a regular
endpoint has. You can then spy on it, or resolve or reject the
corresponding deferred, stored in a `def` property.

This is how you would test a typical controller querying a collection
and storing it into its scope:

    spyOn(api.documents, 'query').andCallThrough();
    ... launch your controller here ...
    expect(api.documents.query).toHaveBeenCalledWith(...);
    // respond with a JSON similar to those returned by Eve
    api.documents.def.query.resolve({ _items: {'whatever'}, _links: {});
    $scope.$digest(); // or $rootScope.$digest(); if in a service
    expect($scope.items).toBe('whatever');

Note that, since we are relying on `$q` in order to handle promises, a
scope `$digest` is needed in order to trigger the promise observers.
