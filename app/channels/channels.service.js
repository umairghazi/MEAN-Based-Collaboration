angular.module('myApp')
    .factory('Channels', function ($http) {

        var userData;
        return {
            createChannel: function (channel) {
                return $http.post('/api/channels', channel);
            },
            registerUser: function (user) {
                return $http.post('/auth/users', user);
            },

            getChannelName: function (channelId) {
                return $http.get('/api/channels/' + channelId)
                    .then(function (data) {
                        return data;
                    })
            },

            getUserName: function (uid) {
                return $http.get('/auth/users/' + uid)
                    .then(function (data) {
                        return data;
                    });
            },


            requireAuth: function () {
                return $http.get('/auth/session');
            },

            loadAll: function () {
                return $http.get('/api/channels')
                    .then(function (data) {
                        return (data)
                    });
            }

        };

    });
