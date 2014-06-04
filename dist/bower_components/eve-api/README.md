[![Build Status](https://travis-ci.org/sourcefabric-innovation/eve-api.png?branch=master)](https://travis-ci.org/sourcefabric-innovation/eve-api)

The built in angular `$resource` is not ideal for interacting with
APIs generated through [Python
Eve](http://python-eve.org/index.html). This module provides an handy
replacement for that.

## Issues using `$resource` with Eve

- every entity sent with `PUT`, `POST` and `PATCH` methods needs to
  send the `_etag` in a `Match-If` header. After this, `_etag` and
  other object properties set by Eve (`_created`, `_status`, etcetera)
  need to be deleted instead before sending
- Eve `DELETE` method requires an `_etag` in the body, while angular
  `$resource` delete actions have no body

## Other features coming with this module

### Define the entities once

Using Eve you will have streamlined interfaces for many resources, all
with the same methods. With the service here you can configure them
once for all in your configuration phase and use them throughout the
whole application

### Leverage Eve HATEOAS

The actual endpoints are requested from the Eve API home page

### Automatically mocked endpoints in the unit tests

See [mocking](https://github.com/sourcefabric-innovation/eve-api/blob/master/mocking.md) for details

## Building

At the moment, just type `make` in this folder. Eventually a grunt
file will be added.

For each new version, remember to update the version in `package.json`
and `bower.json`, and add a tag in the repo

