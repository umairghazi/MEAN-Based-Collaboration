angular.module('myApp')
    .factory('Users',function ($http) {

        return {
            getProfile: function (uid) {
                return $http.get('/auth/users/' + uid);
            },

            getDisplayName : function(uid){
                 return $http.get('/auth/users/' + uid)
                    .then(function(data){
                        return data;
                    })
            },

            all: function(){
                return $http.get('/auth/users/')
                    .then(function(data){
                        return data.data;
                    });
            },

            getAvatar: function(uid){
                // console.log(uid);
                return "../images/profilepictures/"+uid+".jpg";
            }
        };
    });
