angular.module('myApp', ['ui.router', 'ngResource', 'emguo.poller', 'btford.socket-io', 'luegg.directives','angularFileUpload', 'ngSanitize'])
    .config(function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');
        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'home/home.html',
                resolve: {
                    requireNoAuth: function ($state, Auth) {
                        return Auth.requireAuth().then(function (auth) {
                            $state.go('channels');
                        }, function (error) {
                            console.log(error);
                        })
                    }
                }
            })
            .state('login', {
                url: '/login',
                controller: 'AuthCtrl as authCtrl',
                templateUrl: 'auth/login.html',

            })
            .state('register', {
                url: '/register',
                controller: 'AuthCtrl as authCtrl',
                templateUrl: 'auth/register.html',
            })

            .state('profile', {
                url: '/profile',
                controller: 'ProfileCtrl as profileCtrl',
                templateUrl: 'users/profile.html',
                resolve: {
                    auth: function ($state, Auth, Users) {
                        return Auth.requireAuth()
                            .then(function (auth) {
                                return Users.getProfile(auth.data._id);
                            });
                    },
                    profile: function (Users, Auth) {
                        return Auth.requireAuth().then(function (auth) {
                            return Users.getProfile(auth.data._id);
                        })
                    }
                }
            })
            .state('channels', {
                url: '/channels',
                controller: 'ChannelsCtrl as channelsCtrl',
                templateUrl: 'channels/index.html',
                resolve: {
                    channels: function (Channels) {
                        return Channels.loadAll();
                    },

                    profile: function ($state, Auth, Users) {
                        return Auth.requireAuth().then(function (auth) {
                            return Users.getProfile(auth.data._id).then(function (profile) {
                                if (profile.data.username) {
                                    return profile;
                                } else {
                                    $state.go('profile');
                                }
                            });
                        }, function (error) {
                            $state.go('home');
                        });
                    },

                    userId: function (Auth, Users) {
                        return Auth.requireAuth().then(function (auth) {
                            return auth.data._id;
                        })
                    },

                    username: function (Auth, Users) {
                        return Auth.requireAuth().then(function (auth) {
                            var x = auth.data._id;
                            return Auth.getUserName(x).then(function (user) {
                                return user.data.username;
                            })
                        });
                    }
                }
            })
            .state('channels.create', {
                url: '/create',
                templateUrl: 'channels/create.html',
                controller: 'ChannelsCtrl as channelsCtrl'
            })
            .state('channels.messages', {
                url: '/{channelId}/messages',
                controller: 'MessagesCtrl as messagesCtrl',
                templateUrl: 'channels/messages.html',
                resolve: {
                    messages: function ($stateParams, Messages) {
                        return Messages.forChannel($stateParams.channelId)
                            .then(function (messages) {
                                return messages;
                            })
                            .catch(function (error) {
                                console.log(error);
                            });
                    },
                    channelName: function ($stateParams, Channels) {
                        // return '#' + Channels.getChannelName($stateParams.channelId);
                        return Channels.getChannelName($stateParams.channelId)
                            .then(function (data) {
                                return data;
                            })
                    },

                    channelId: function ($stateParams) {
                        return $stateParams.channelId;
                    },

                }
            })
            .state('channels.direct', {
                url: '/{uid}/messages/direct',
                templateUrl: 'channels/userMessages.html',
                controller: 'UserMessagesCtrl as userMessagesCtrl',
                resolve: {
                    messages: function ($stateParams, profile, Messages) {
                        return Messages.forUsers($stateParams.uid, profile.data._id);
                    },
                    channelName: function ($stateParams, Users) {
                        return Users.getDisplayName($stateParams.uid).then(function (data) {
                            return data.data.username;
                        });
                    },
                    fromUserId: function (profile) {
                        return profile.data._id;
                    },
                    toUserId: function ($stateParams) {
                        return $stateParams.uid;
                    }

                }
            });


    }).constant('url', 'http://localhost:3000/');
