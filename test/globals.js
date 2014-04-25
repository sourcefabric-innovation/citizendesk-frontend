var  globals = {
  root: 'http://127.0.0.1:5000',
  /* this helps creating sails mocks */
  sailsWrapResponse: function(response, failure) {
    return {
      success: function(f) {
        if (!failure) {
          f(response);
        }
      },
      error: function(f) {
        if (failure) {
          f(response);
        }
      }
    };
  },
  /* a dumb default sails mock returning three empty objects */
  sails: {
    on: function() {},
    get: function() {
      return globals.sailsWrapResponse([{},{},{}]);
    },
    post: function() {
      return globals.sailsWrapResponse({
        id: "abcabcabc", // hexadecimal
        createdAt: "2014-04-24T10:58:28.053Z",
        updatedAt: "2014-04-24T10:58:28.054Z"        
        // there will also be the rest of the created object properties here
      });
    },
    put: function() {
      return globals.sailsWrapResponse({});
    }
  },
  SocketsHelpers: {
    save: function() {
      return {
        success: function() {
          return {
            error: function() {}
          }
        },
        error: function() {}
      };
    }
  }
};
