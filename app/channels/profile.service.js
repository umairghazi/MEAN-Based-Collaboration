angular.module('myApp')
    .factory('Profile', function (Auth,Shared) {

        var profileObj = {};


        var displayName = "";
        var emailHash = "";
        var online = {
            id: true
        }

        return {
            createChannel: function(channel){
                console.log(Shared.userData.data);
            }
        };

        // return {
        //     createChannel: function (channel) {
        //         return $http.post('/api/channel', channel);
        //     },
        //     registerUser: function (user) {
        //         return $http.post('/auth/users', user);
        //     },
        //
        //     requireAuth: function () {
        //         return $http.get('/auth/session');
        //     }
        //
        // };

    });
