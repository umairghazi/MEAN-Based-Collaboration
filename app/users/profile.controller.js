angular.module('myApp')
    .controller('ProfileCtrl',function($state,auth,profile){
        var self = this;
        self.profile = profile;

        self.updateProfile = function() {
            self.profile.email = (auth.data.username);
            // self.profile.save().then(function(){
                $state.go('channels');
            // });
        };
    });
