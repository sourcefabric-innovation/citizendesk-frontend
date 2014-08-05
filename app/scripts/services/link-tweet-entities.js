'use strict';

/* jshint camelcase: false */

angular.module('citizendeskFrontendApp')
  .factory('linkTweetEntities', function () {
    function patch(patched, patching, start, stop) {
      var beginning = patched.slice(0, start),
          end       = patched.slice(stop);
      return beginning + patching + end;
    }
    function patchAll(patched, patches) {
      /* reverse sorting the patches and thus applying them from the
      last one, we are sure that the indexes are still valid */
      patches.sort(function(a, b){
        return b.indices[0] - a.indices[0];
      });
      patches.forEach(function(p) {
        patched = patch(patched, p.text, p.indices[0], p.indices[1]);
      });
      return patched;
    }
    function anchorify(arg) {
      return '<a href="'+arg.reference+'" target="_blank">'+arg.text+'</a>';
    }
    function reference(key, value) {
      switch (key) {
        case 'user_mentions': return {
          text: '@' + value.screen_name,
          reference: 'https://twitter.com/' + value.screen_name
        };
        case 'hashtags': return {
          text: '#' + value.text,
          reference: 'https://twitter.com/search?q=%23' + value.text
        };
        case 'urls': return {
          text: value.display_url,
          reference: value.url
        };
      }
    }
    function linkTweetEntities(report) {
      var entities = [
        'user_mentions',
        'hashtags',
        'urls'
      ];
      var patches = [];
      entities.forEach(function(entity) {
        report.original.entities[entity].forEach(function(e) {
          var p = {
            text: anchorify(reference(entity, e)),
            indices: e.indices
          };
          patches.push(p);
        });
      });
      return patchAll(report.original.text, patches);
    }
    // functions are attached here just in order to expose them for testing
    linkTweetEntities.patch = patch;
    linkTweetEntities.patchAll = patchAll;
    linkTweetEntities.anchorify = anchorify;
    linkTweetEntities.reference = reference;
    return linkTweetEntities;
  });
