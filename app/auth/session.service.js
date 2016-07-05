angular.module('myApp')
    .factory('Session', function($resource) {
      return $resource('/auth/session');
});
