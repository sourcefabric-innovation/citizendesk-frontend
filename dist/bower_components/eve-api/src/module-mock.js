'use strict';

/**
 * Api provider mock, to be used in unit tests
 */
angular
    .module('eveApi', ['ng'])
    .provider('api', function() {
        var entities = [],
            methods = [
                'query',
                'save',
                'getById',
                'update',
                'remove',
                'create',
                'replace'
            ];

        this.api = function(name, config) {
            entities.push(name);
            return this;
        };

        this.$get = ['$q', function($q) {
            var api = {};
            entities.forEach(function(entity) {
                var o = {
                    def: {
                    },
                    reset: {
                    }
                };
                methods.forEach(function(methodName) {
                    var deferred;
                    o.reset[methodName] = function() {
                        deferred = $q.defer();
                        o[methodName] = function (){
                            return deferred.promise;
                        };
                        o.def[methodName] = deferred;
                    };
                    o.reset[methodName]();
                });
                api[entity] = o;
            });
            return api;
        }];
    });
