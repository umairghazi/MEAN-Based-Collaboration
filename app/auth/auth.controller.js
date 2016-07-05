angular.module('myApp')
    .controller('AuthCtrl', function ($scope, $http, $state, Auth,Channels) {

        var self = this;
        self.user = {
            email: '',
            password: '',
            online : ''

        };

        self.login = function (provider, user) {
            self.user.online = true;
            Channels.userData = self.user;
            Auth.loginUser(self.user)
                .then(function (data) {
                    if (data.statusText) {
                        $state.go('home');
                    }
                }).catch(function (data) {
                console.log(data);
            });
        };

        self.register = function () {
            Auth.registerUser(self.user)
                .then(function (data) {
                    if (data.statusText) {
                        self.login();
                    }
                }).catch(function (data) {
                console.log(data);
            });
        }
    });
