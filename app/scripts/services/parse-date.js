'use strict';

// check http://www.cl.cam.ac.uk/~mgk25/iso-time.html for info about
// the standard

angular.module('citizendeskFrontendApp')
  .factory('parseDate', function () {
    return function(s) {
      var split = s.split('T'),
          dateString = split[0],
          rest = split[1];
      var dateSplit = dateString.split('-'),
          restSplit = rest.split('+'),
          timeString = restSplit[0],
          timeSplit = timeString.split(':');
      if (restSplit[1] != '0000') {
        throw Error('Date ' + s + ' is probably not in UTC time, or not in the expected format');
      }
      function p(s) {
        return parseInt(s, 10);
      }
      dateSplit = dateSplit.map(p);
      timeSplit = timeSplit.map(p);
      var year = dateSplit[0],
          month = dateSplit[1] - 1, // input starts from 1, output from 0
          day = dateSplit[2],
          hour = timeSplit[0],
          minute = timeSplit[1],
          second = timeSplit[2];
      // no comment
      return new Date(Date.UTC(year, month, day, hour, minute, second));
    };
  });
