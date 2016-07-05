angular.module('myApp')
    .factory('Messages', function ($http) {

        return {
            forChannel: function (channelId) {
                var url = "/api/chats/" + channelId;
                return $http.get(url);
            },

            sendMessage: function (data) {
                return $http.post('/api/chats/', data);
            },

            sendUserMessage: function(data){
                return $http.post('api/chats/users',data);
            },

            forUsers: function (uid1, uid2) {
                var path = uid1 < uid2 ? uid1 + '/' + uid2 : uid2 + '/' + uid1;
                return $http.get('/api/chats/users/' + path);
            }
        };
    });
