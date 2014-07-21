var globals = {
  root: 'http://cd2.sourcefabric.net/citizendesk-interface/',
  mockEndpoint: function(endpoint, method, data) {
    var f;
    function promising(data) {
      return function() {
        return {
          then: function(g) {
            f = g;
          }
        };
      };
    }
    endpoint[method] = promising(data);
    endpoint.flush = function() {
      f(data);
    };
    return endpoint;
  }
};
