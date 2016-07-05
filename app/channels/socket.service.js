angular.module('myApp')
    .factory('socket', function (socketFactory) {
        return socketFactory();
    });
