angular.module('myApp')
    .factory('Poller', function ($http, $timeout) {
        var data = {response: {}, calls: 0};
        var poller = function (channelId) {
            $http.get('/api/chats/' + channelId)
                .then(function (r) {
                    data.response = r.data;
                    data.calls++;
                    $timeout(poller, 1000);
                });
        };
        poller();

        return {
            data: data
        };
    });
