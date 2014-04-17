var root = 'http://127.0.0.1:5000';
/* this helps creating sails mocks */
function sailsWrapResponse(response) {
  return {
    success: function(f) {
      f(response);
    }
  };
}
/* a dumb default sails mock returning three empty objects */
var  $sails = {
  on: function() {},
  get: function() {
    return sailsWrapResponse([{},{},{}]);
  }
};
