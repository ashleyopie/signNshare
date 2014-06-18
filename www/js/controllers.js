angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $cordovaCamera, $ionicModal, $window) {

    $scope.$watch('penColor', function(data) {
        $scope.penColor = data;
    });


    $ionicModal.fromTemplateUrl('templates/modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });
    $scope.openModal = function() {
        $scope.modal.show();
    };
    $scope.closeModal = function() {
        $scope.modal.hide();
    };
    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
        $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hide', function() {
        // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
        // Execute action
    });

    $scope.isReset = -1;

    $scope.reset = function() {
        $scope.isReset *= -1;
    };


    $scope.takePicture = function(source) {


        $cordovaCamera.getPicture().then(function(imageURI) {
            //console.log(imageURI);
            $scope.lastPhoto = imageURI;
            $scope.openModal();
        }, function(err) {
            console.log(err);
        }, {
            quality: 90,
            // targetWidth: $window.innerWidth,
            // targetHeight: $window.innerHeight,
            saveToPhotoAlbum: true,
            sourceType: source,
            destinationType: Camera.DestinationType.DATA_URL
        });
    };

    $scope.saveToGallery = function() {
        window.canvas2ImagePlugin.saveImageDataToLibrary(
            function(msg) {
                console.log(msg);
                $scope.filepath = msg;
                //alert('success!');
                window.plugins.socialsharing.share(null, null, 'file://' + $scope.filepath, null);
            },
            function(err) {
                console.log(err);
            },
            document.getElementById('canvas')
        );
    };
    /**
     * Converts an image to
     * a base64 string.
     *
     * If you want to use the
     * outputFormat or quality param
     * I strongly recommend you read the docs
     * @ mozilla for `canvas.toDataURL()`
     *
     * @param   {String}    url
     * @param   {Function}  callback
     * @param   {String}    [outputFormat='image/png']
     * @param   {Float}     [quality=0.0 to 1.0]
     * @url     https://gist.github.com/HaNdTriX/7704632/
     * @docs    https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement#Methods
     * @author  HaNdTriX
     * @example
     *          imgToDataURL('http://goo.gl/AOxHAL', function(err, base64Img){
     *              console.log('IMAGE:',base64Img);
     *          })
     */


})

.controller('AcctCtrl', function($scope, $location, $stateParams, OpenFB) {

    // $scope.logout = function() {
    //     OpenFB.logout();
    //     $state.go('tab.dash');
    // };

    // $scope.revokePermissions = function() {
    //     OpenFB.revokePermissions().then(
    //         function() {
    //             $location.path('#/tab/dash');
    //         },
    //         function() {
    //             alert('Revoke permissions failed');
    //         });
    // };

})

.controller('LoginCtrl', function($scope, $state, $stateParams, $log, $location, OpenFB) {

    // $scope.facebookLogin = function() {

    //     OpenFB.login('email,read_stream,publish_stream').then(
    //         function() {
    //             $log.log('Login success... changing state to.. ', $stateParams);

    //             $state.go('tab.dash');
    //         },
    //         function() {
    //             alert('OpenFB login failed');
    //         });
    // };

})
//sample facebook ui controller
.controller('ProfileCtrl', function($scope, $log, OpenFB) {
    // OpenFB.get('/me').success(function(user) {
    //     $scope.user = user;
    //     $log.log(user);
    // });
})

.controller('FriendsCtrl', function($scope, Friends) {
    $scope.friends = Friends.all();
})

.controller('FriendDetailCtrl', function($scope, $stateParams, Friends) {
    $scope.friend = Friends.get($stateParams.friendId);
})

.controller('AccountCtrl', function($scope) {})

.directive("drawing", function() {
    return {
        restrict: "A",
        link: function(scope, element, attrs, $ionicGesture) {

            var ctx = element[0].getContext('2d');

            //  console.log(scope, element, attrs, ctx);

            // variable that decides if something should be drawn on mousemove
            var drawing = false;

            // the last coordinates before the current move
            var lastX;
            var lastY;

            var image = new Image();
            scope.$watch('lastPhoto', function() {
                image.src = attrs.camimage;
                image.onload = function() {
                    ctx.drawImage(image, 0, 0, image.width / 5, image.height / 5);
                };
                //draw dummy image
            });

            scope.$watch('isReset', function() {
                reset();
                var image = new Image();
                image.src = attrs.camimage;
                image.onload = function() {
                    ctx.drawImage(image, 0, 0, image.width / 5, image.height / 5);
                };
            });

            ionic.on('touchstart', function(event) {
                // console.log('drawing', event);

                lastX = event.changedTouches[0].pageX + event.layerX;
                lastY = event.changedTouches[0].pageY + event.layerY;

                // begins new line
                ctx.beginPath();

                drawing = true;
            }, element[0]);

            ionic.on('touchmove', function(event) {
                event.preventDefault();
                if (drawing) {
                    // console.log('dragging', event);
                    // get current mouse position
                    currentX = event.changedTouches[0].pageX + event.layerX;
                    currentY = event.changedTouches[0].pageY + event.layerY;

                    width = (event.changedTouches[0].webkitRadiusX + event.changedTouches[0].webkitRadiusY) * event.changedTouches[0].webkitForce;

                    draw(lastX, lastY, currentX, currentY, width);

                    // set current coordinates to last one
                    lastX = currentX;
                    lastY = currentY;
                }
            }, element[0]);

            ionic.on('touchstop', function(event) {
                event.preventDefault();
                // stop drawing
                // console.log('stopped');
                drawing = false;
            }, element[0]);


            //temp comment out the calls for usage on a pc

            element.bind('mousedown', function(event) {

                lastX = event.offsetX;
                lastY = event.offsetY;

                // begins new line
                ctx.beginPath();

                drawing = true;
            });

            element.bind('mousemove', function(event) {
                if (drawing) {
                    // get current mouse position
                    currentX = event.offsetX;
                    currentY = event.offsetY;

                    draw(lastX, lastY, currentX, currentY);

                    // set current coordinates to last one
                    lastX = currentX;
                    lastY = currentY;
                }

            });
            element.bind('mouseup', function(event) {
                // stop drawing
                drawing = false;
            });

            // canvas reset
            function reset() {
                console.log(element);
                element[0].width = element[0].width;
            }

            function draw(lX, lY, cX, cY, width) {
                // line from
                ctx.moveTo(lX, lY);
                // to
                ctx.lineTo(cX, cY);
                // color
                ctx.strokeStyle = scope.penColor;
                //width
                ctx.lineWidth = width;
                // draw it
                ctx.stroke();
            }
        }
    };
});