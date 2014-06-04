angular.module('eveApi', ['ng']);
    'use strict';

    /**
     * Api layer provider
     */
angular
  .module('eveApi')
  .provider('api', function() {
        var apis = {};

        /**
         * Register an api
         */
        this.api = function(name, config) {
            apis[name] = config;
            return this;
        };

        this.$get = apiServiceFactory;

        apiServiceFactory.$inject = ['$injector',
                                     'HttpEndpoint'];
        function apiServiceFactory($injector, HttpEndpoint) {

            var endpoints = {
                'http': HttpEndpoint
            };

            return _.mapValues(apis, function(config, apiName) {
                var service = config.service || _.noop;
                service.prototype = new endpoints[config.type](apiName, config.backend);
                return $injector.instantiate(service, {resource: service.prototype});
            });
        }
    });
//define(['lodash'], function(_) {
    'use strict';

    /**
     * Http endpoint factory
     */
angular
  .module('eveApi')
  .factory('HttpEndpoint', ['$http', '$q', 'urls', function($http, $q, urls) {
      var metadataProperties = [
          '_links',
          '_id',
          '_etag',
          '_created',
          '_updated',
          '_status'
      ];

        /**
         * Get url for given resource
         *
         * @param {Object} resource
         * @returns {Promise}
         */
        function getUrl(resource) {
            return urls.resource(resource.rel);
        }

        /**
         * Get headers for given resource
         *
         * @param {Object} resource
         * @param {Object} item
         * @returns {Object}
         */
        function getHeaders(resource, item) {
            var headers = _.extend({}, resource.config.headers || {});
            if (item && item._etag) {
                headers['If-Match'] = item._etag;
            }
            return headers;
        }

        /**
         * Wrap $http call
         *
         * @param {Object} config
         * @returns {Promise}
         */
        function http(config) {
            return $q.when(config.url)
                .then(function(url) {
                    config.url = url;
                    return $http(config);
                })
                .then(function(response) {
                    if (response.status >= 200 && response.status < 300 &&
                    (!response.data || !response.data._status || response.data._status !== 'ERR')) {
                        return response;
                    } else {
                        return $q.reject(response);
                    }
                });
        }

        /**
         * Http Endpoint
         */
        function HttpEndpoint(name, config) {
            this.name = name;
            this.config = config;
            this.rel = config.rel;
        }

        /**
         * Get entity by url
         *
         * @param {string} url
         * @returns {Promise}
         */
        HttpEndpoint.prototype.getByUrl = function(url) {
            return http({
                method: 'GET',
                url: urls.item(url)
            }).then(function(response) {
                return response.data;
            });
        };

        /**
         * Get entity by given id
         *
         * @param {string} id
         * @param {Object} params -- optional
         * @returns {Promise}
         */
        HttpEndpoint.prototype.getById = function(id, params) {
            return getUrl(this).then(_.bind(function(resourceUrl) {
                var url = resourceUrl.replace(/\/+$/, '') + '/' + id;
                return http({
                    method: 'GET',
                    url: url,
                    params: params
                }).then(function(response) {
                    return response.data;
                });
            }, this));
        };

        /**
         * Resource query method
         *
         * @param {Object} params
         */
        HttpEndpoint.prototype.query = function(params) {
            return http({
                method: 'GET',
                params: params,
                url: getUrl(this),
                headers: getHeaders(this)
            }).then(function(response) {
                return response.data;
            });
        };

        /**
         * Update item
         *
         * @param {Object} item
         * @param {Object} diff
         * @returns {Promise}
         */
        HttpEndpoint.prototype.update = function(item, diff) {
            if (diff == null) {
              diff = _.omit(item, metadataProperties);
            }
            var url = item._links.self.href;
            return http({
                method: 'PATCH',
                url: urls.item(url),
                data: diff,
                headers: getHeaders(this, item)
            }).then(function(response) {
                _.extend(item, response.data);
                return item;
            });
        };

        /**
         * Create new item
         *
         * @param {Object} itemData
         * @returns {Promise}
         */
        HttpEndpoint.prototype.create = function(itemData) {
            return http({
                method: 'POST',
                url: getUrl(this),
                data: itemData,
                headers: getHeaders(this)
            }).then(function(response) {
                _.extend(itemData, response.data);
                return itemData;
            });
        };

        /**
         * Save item
         *
         * @param {Object} item
         * @param {Object} diff
         * @returns {Promise}
         */
        HttpEndpoint.prototype.save = function(item, diff) {
            return item._id ? this.update(item, diff) : this.create(_.extend(item, diff));
        };

        /**
         * Replace item
         *
         * @param {Object} dest
         * @param {Object} item
         * @returns {Promise}
         */
        HttpEndpoint.prototype.replace = function(dest, item) {
            var copy = _.omit(item, metadataProperties);
            return http({
                method: 'PUT',
                url: urls.item(dest),
                data: copy,
                headers: getHeaders(this, item)
            }).then(function(response) {
                // when `replace` is used to delete a property in the
                // item, relying on the extension will not be enough
                _.extend(item, response.data);
                return item;
            });
        };

        /**
         * Remove item
         *
         * @param {Object} item
         * @returns {Promise}
         */
        HttpEndpoint.prototype.remove = function(item) {
            return http({
                method: 'DELETE',
                url: urls.item(item._links.self.href),
                headers: getHeaders(this, item)
            }).then(null, function(response) {
                return response.status === 404 ? $q.when(response) : $q.reject(response);
            });
        };

        /**
         * Get resource url
         *
         * @returns {Promise}
         */
        HttpEndpoint.prototype.getUrl = function() {
            return getUrl(this);
        };

        /**
         * Get headers
         *
         * @return {Object}
         */
        HttpEndpoint.prototype.getHeaders = function() {
            return getHeaders(this) || {};
        };

        return HttpEndpoint;

    }]);
//});
    'use strict';

angular
  .module('eveApi')
  .service('urls', ['$http', '$q', 'config', function($http, $q, config) {

        var links;

        /**
         * Get url for given resource
         *
         * @param {String} resource
         * @returns Promise
         */
        this.resource = function(resource) {
            return getResourceLinks().then(function() {
                return links[resource] ? links[resource] : $q.reject(resource);
            });
        };

        /**
         * Get server url for given item
         *
         * @param {String} item
         * @returns {String}
         */
        this.item = function(item) {
            return config.server.url + item;
        };

        /**
         * Get resource links via root url
         *
         * @returns {Promise}
         */
        function getResourceLinks() {

            if (links != null) {
                return $q.when(links);
            }

            return $http({
                method: 'GET',
                url: config.server.url
            }).then(function(response) {
                links = {};

                if (response.status === 200) {
                    _.each(response.data._links.child, function(link) {
                        links[link.title] = config.server.url + link.href;
                    });
                } else {
                    $q.reject(response);
                }

                return links;
            });
        }
  }]);
