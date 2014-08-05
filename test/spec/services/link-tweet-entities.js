'use strict';

describe('Service: linkTweetEntities', function () {

  // load the service's module
  beforeEach(module('citizendeskFrontendApp'));

  // instantiate service
  var linkTweetEntities;
  beforeEach(inject(function (_linkTweetEntities_) {
    linkTweetEntities = _linkTweetEntities_;
  }));

  it('has a nice patch function', function(){
    expect(linkTweetEntities.patch('a nice string', 'patched', 2, 6))
      .toBe('a patched string');
  });
  it('has a nice function to patch all at a time', function(){
    expect(linkTweetEntities.patchAll('a nice string', [{
      text: 'patched',
      indices: [2, 6]
    }, {
      text: 'all',
      indices: [0, 1]
    }, {
      text: 'o',
      indices: [10, 11]
    }]))
      .toBe('all patched strong');
  });
  it('has an anchorify function', function(){
    expect(linkTweetEntities.anchorify({
      text: 'text',
      reference: 'reference'
    }))
      .toBe('<a href="reference" target="_blank">text</a>');
  });
  /*
   
   following is taken from the Twitter display requirements
   https://dev.twitter.com/terms/display-requirements
   
   */
  describe('Tweet Entities within the Tweet text must be properly linked to their appropriate home on Twitter. For example:', function(){
    it('User_mentions must link to the mentioned user\'s profile', function(){
      expect(linkTweetEntities.reference('user_mentions', {
        screen_name: 'aname'
      }))
        .toEqual({
          text: '@aname',
          reference: 'https://twitter.com/aname'
        });
    });
    it('Hashtags must link to a Twitter search with the hashtag as the query', function(){
      expect(linkTweetEntities.reference('hashtags', {
        text: 'Ukraine'
      }))
        .toEqual({
          text: '#Ukraine',
          reference: 'https://twitter.com/search?q=%23Ukraine'
        });
    });
    it('Links in Tweet text must be displayed using the display_url field in the URL entities API response, and link to the original t.co url field', function(){
      expect(linkTweetEntities.reference('urls', {
        display_url: 'bbc.in/1oor8RQ',
        url: 'http://t.co/duECwMfNy7'
      }))
        .toEqual({
          text: 'bbc.in/1oor8RQ',
          reference: 'http://t.co/duECwMfNy7'
        });
    });
  });
  /* advice: use this test just as a final check, disable it and work
  on the smaller ones if there is some trouble */
  it('links tweet entities', function () {
    var HTML = linkTweetEntities(mocks.reports['53e101769c61677c18dfa0e4']);
    expect(HTML).toBe('Number fleeing war in east <a href="https://twitter.com/search?q=%23Ukraine" target="_blank">#Ukraine</a> now over 270,000 in total - <a href="https://twitter.com/TomBurridgebbc" target="_blank">@TomBurridgebbc</a> reports <a href="http://t.co/duECwMfNy7" target="_blank">bbc.in/1oor8RQ</a> http://t.co/kKSCUmCEND');
  });
});
