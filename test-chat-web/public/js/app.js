'use strict';

var app = angular.module('test-chat', ['ngMaterial', 'ngAnimate', 'ngMdIcons', 'btford.socket-io'])
var serverBaseUrl = 'http://localhost:2016';
app.factory('socket', function (socketFactory) {
    var myIoSocket = io.connect(serverBaseUrl);

    var socket = socketFactory({
        ioSocket: myIoSocket
    });

    return socket;
});
app.controller('MainCtrl', function ($scope, $mdDialog, socket, $http) {
    $scope.messages = [];


    socket.on('user joined', function (data) {
        console.log(data.username + ' has joined');
    });
    socket.on('setup', function (data) {
		
    });
	
    socket.on('message created', function (data) {
        $scope.messages.push(data);
    });
    $scope.send = function (msg) {
        socket.emit('new message', {
            message: msg,
        });
		$scope.message = null;

    };
	$http.get(serverBaseUrl + '/msg').success(function (msgs) {
                    $scope.messages = msgs;
                });
});
app.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
});

