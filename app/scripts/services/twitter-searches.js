'use strict';

angular.module('citizendeskFrontendApp')
  .service('TwitterSearches', ['$sails', '$rootScope', function TwitterSearches($sails, $rootScope) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var service = this;
    this.slugify = function(text) {
      return text.split(' ').join('-');
    };
    // calling `get` just in order to be subscribed to the collection messages
    $sails.get('/reports?limit=1').error(Raven.captureSocketError);
    /*
     register the queue for real time report creation. doing like
     this for every queue is inefficient, but the number of queues
     is very low

     this is also a potential leak, because the following reference to
     the queue will remain even if the queue is removed from its array
     around
     */
    function register(queue) {
      $sails.on('message', function (message) {
        if (message.model === 'reports' && message.verb === 'create') {
          $rootScope.$apply(function() {
            var report = message.data,
                channel = report.channels[0],
                searchChannel = channel && channel.type === 'search';
            if (searchChannel && channel.request === queue.id) {
              queue.reports.unshift(report);
            }
          });
        }
      });
    }
    this.create = function(text) {
      var queue = {
        slug: service.slugify(text),
        terms: text,
        description: text,
        reports: [],
        type: 'search'
      };
      register(queue);
      return queue;
    };
    this.getBySlug = function(queues, slug) {
      for (var i=0; i<queues.length; i++) {
        var queue = queues[i];
        if (queue.type === 'search') {
          if (typeof slug === 'undefined' || queue.slug === slug) {
            return queue;
          }
        }
      }
    };
  }]);
