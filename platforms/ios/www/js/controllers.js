angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $cordovaCamera) {


    $scope.takePicture = function() {
        $cordovaCamera.getPicture().then(function(imageURI) {
            //console.log(imageURI);
            $scope.lastPhoto = imageURI;
        }, function(err) {
            console.err(err);
        }, {
            quality: 75,
            targetWidth: 320,
            targetHeight: 320,
            saveToPhotoAlbum: true,
            destinationType: 'Camera.DestinationType.FILE_URI'
        });
    };


})

.controller('FriendsCtrl', function($scope, Friends) {
    $scope.friends = Friends.all();
})

.controller('FriendDetailCtrl', function($scope, $stateParams, Friends) {
    $scope.friend = Friends.get($stateParams.friendId);
})

.controller('AccountCtrl', function($scope) {});