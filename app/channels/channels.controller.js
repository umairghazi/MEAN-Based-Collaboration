angular.module('myApp')
    .controller('ChannelsCtrl', function ($scope, $http, $state, Auth, Users, Channels, channels, profile) {

        var self = this;

        //Users.setOnline(profile.$id);

        self.profile = profile;
        self.channels = channels.data;
        // self.getGravatar = Users.getAvatar;
        self.userss = Users.all();
        self.userss.then(function (data) {
            self.users = data;
        });

        self.logout = function () {
            Auth.logout(Channels.userData)
                .then(function (data) {
                }).catch(function (err) {
                console.log(err);
            });
        };

        self.newChannel = {
            name: ''
        };

        self.createChannel = function () {
            Channels.createChannel(self.newChannel)
                .then(function (ref) {
                    $state.go('channels.messages', {channelId: ref.data._id});
                }).catch(function (err) {
                console.log(err);
            });
        };

    });