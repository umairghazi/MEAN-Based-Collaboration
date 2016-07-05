angular.module('myApp')
    .controller('MessagesCtrl', function ($scope, $resource, messages, channelName, profile, channelId, userId, username, Messages, poller, socket, FileUploader) {


        // $.getJSON( '/download', function( data ){
        //     var tableContent;
        //     console.log(data);
        //     for(var item in data) { // one by one get and add fortable
        //         console.log(data[item]);
        //         tableContent += '<tr>';
        //         tableContent += '<td>' + data[item] + '</td>'; // this file name column
        //         tableContent += '<td><a href='+'/'+data[item]+'>' + data[item]+ '</a></td>'; // this was the link column
        //     }// this all added into the tableContent variable
        //     $('#download table tbody').html(tableContent); // add into the table
        // });

        var self = this;
        self.channelName = "#" + channelName.data;
        self.message = '';

        $scope.submit = function () {
            if ($scope.form.file.$valid && $scope.file) {
                $scope.upload($scope.file);
            }
        };

        var uploader = $scope.uploader = new FileUploader({
            url: 'api/chats/uploads'
        });

        uploader.onBeforeUploadItem = function (fileItem) {
            fileItem.formData.push({username: username, channelname: channelName.data, userid: userId});
        };

        uploader.onCompleteItem = function (fileItem, response, status, headers) {
            var msg = {
                channelId: channelId,
                body: response.username + ' shared the file ' + response.originalName,
                timestamp: response.timestamp,
                uid: response.userid,
                username: response.username,
                encodedName: response.modifiedName
            };

            Messages.sendMessage(msg)
                .then(function (data) {
                    self.message = "";
                })
                .catch(function (data) {
                    console.log(data);
                });


            // if (status == 200) {
            //     var blob = new Blob([response], {type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'});
            //     var downloadUrl = URL.createObjectURL(blob);
            //     var a = document.createElement("a");
            //     a.href = downloadUrl;
            //     a.download = "data.docx";
            //     document.body.appendChild(a);
            //     // a.click();
            // } else {
            //     alert('Unable to download excel.')
            // }
        };

        /****** ---- Polling way of getting chats ---- ******/

        // var myPoller = poller.get('/api/chats/' + channelId,
        //     {
        //         delay: 500
        //     });
        // myPoller.promise.then(null, null, function (data) {
        //     self.messages = data.data;
        // });


        /****** ---- Socket way of getting chats ---- ******/


        Messages.forChannel(channelId).then(function (data) {
            self.messages = data.data;
        });


        socket.on('posted', function (data) {
            self.messages.push(data);
        });

        // var msg;
        // socket.on('fileuploaded',function(data){
        //     msg = {
        //         channelId : channelId,
        //         Message :{
        //             body:  data.msg,
        //             timestamp: Date.now(),
        //             uid : userId,
        //             username: username
        //         }
        //     };
        //     self.messages.push(msg);
        //     socket.emit('fromClient', msg);
        // });

        self.sendMessage = function () {
            if (self.message.length > 0) {
                var messageData = {
                    channelId: channelId,
                    username: username,
                    uid: userId,
                    body: self.message,
                    timestamp: Date.now()
                };

                Messages.sendMessage(messageData)
                    .then(function (data) {
                        self.message = "";
                    })
                    .catch(function (data) {
                        console.log(data);
                    });
            }
        };
    });
