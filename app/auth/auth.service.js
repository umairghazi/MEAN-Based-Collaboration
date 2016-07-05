angular.module('myApp')
    .factory('Auth', function ($http, url) {

        return {
            loginUser: function (user) {
                return $http.post('/auth/session', user);
            },
            registerUser: function (user) {
                return $http.post('/auth/users', user);
            },

            requireAuth: function () {
                return $http.get('/auth/session');
            },

            getUserName: function(userId){
                return $http.get('/auth/users/'+userId);
            },
            
            logout: function(user){
                return $http.delete('/auth/session',user);
            },
        };
    });
