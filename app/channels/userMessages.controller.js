angular.module('myApp')
    .controller('UserMessagesCtrl', function (messages, channelName, fromUserId, toUserId, socket, Messages) {


        var self = this;
        self.channelName = "@" + channelName;
        self.message = '';
        self.messages = messages.data;


        /****** ---- Polling way of getting chats ---- ******/

        // var myPoller = poller.get('/api/chats/' + channelId,
        //     {
        //         delay: 500
        //     });
        // myPoller.promise.then(null, null, function (data) {
        //     self.messages = data.data;
        // });


        /****** ---- Socket way of getting chats ---- ******/


        // Messages.forUsers(fromUserId,toUserId).then(function (data) {
        //     console.log(data);
        //     // self.messages = data.data;
        // });


        socket.on('userposted', function (data) {
                self.messages.push(data);

        });


        self.sendMessage = function () {
            if (self.message.length > 0) {
                var messageData = {
                    fromUserId: fromUserId,
                    toUserId: toUserId,
                    body: self.message,
                    timestamp: Date.now()
                };

                Messages.sendUserMessage(messageData)
                    .then(function (data) {
                        self.message = "";
                    })
                    .catch(function (data) {
                        console.log(data);
                    });
            }
        };
    });
