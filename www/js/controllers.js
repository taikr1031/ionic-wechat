angular.module('wechat.controllers', [])

    .controller('findCtrl', function ($scope, $state) {
      $scope.onSwipeLeft = function () {
        $state.go("tab.setting");
      };
      $scope.onSwipeRight = function () {
        $state.go("tab.friends");
      };
    })

    .controller('messageCtrl', function ($scope, $state, $ionicPopup, localStorageService, messageService) {

      // $scope.messages = messageService.getAllMessages();
      // console.log($scope.messages);
      $scope.onSwipeLeft = function () {
        $state.go("tab.friends");
      };
      $scope.popupMessageOpthins = function (message) {
        $scope.popup.index = $scope.messages.indexOf(message);
        $scope.popup.optionsPopup = $ionicPopup.show({
          templateUrl: "templates/popup.html",
          scope: $scope,
        });
        $scope.popup.isPopup = true;
      };
      $scope.markMessage = function () {
        var index = $scope.popup.index;
        var message = $scope.messages[index];
        if (message.showHints) {
          message.showHints = false;
          message.noReadMessages = 0;
        } else {
          message.showHints = true;
          message.noReadMessages = 1;
        }
        $scope.popup.optionsPopup.close();
        $scope.popup.isPopup = false;
        messageService.updateMessage(message);
      };
      $scope.deleteMessage = function () {
        var index = $scope.popup.index;
        var message = $scope.messages[index];
        $scope.messages.splice(index, 1);
        $scope.popup.optionsPopup.close();
        $scope.popup.isPopup = false;
        messageService.deleteMessageId(message.id);
        messageService.clearMessage(message);
      };
      $scope.topMessage = function () {
        var index = $scope.popup.index;
        var message = $scope.messages[index];
        if (message.isTop) {
          message.isTop = 0;
        } else {
          message.isTop = new Date().getTime();
        }
        $scope.popup.optionsPopup.close();
        $scope.popup.isPopup = false;
        messageService.updateMessage(message);
      };
      $scope.messageDetils = function (message) {
        $state.go("messageDetail", {
          "messageId": message.id
        });
      };
      $scope.$on("$ionicView.beforeEnter", function () {
        // console.log($scope.messages);
        $scope.messages = messageService.getAllMessages();
        $scope.popup = {
          isPopup: false,
          index: 0
        };
      });

    })

    .controller('friendsCtrl', function ($scope, $state) {
      $scope.onSwipeLeft = function () {
        $state.go("tab.find");
      };
      $scope.onSwipeRight = function () {
        $state.go("tab.message");
      };
      $scope.contacts_right_bar_swipe = function (e) {
        console.log(e);
      };
    })

    .controller('settingCtrl', function ($scope, $state) {
      $scope.onSwipeRight = function () {
        $state.go("tab.find");
      };
    })

    .controller('messageDetailCtrl', ['$scope', '$stateParams',
      'messageService', '$ionicScrollDelegate', '$ionicActionSheet', '$timeout',
      function ($scope, $stateParams, messageService, $ionicScrollDelegate, $ionicActionSheet, $timeout) {
        var viewScroll = $ionicScrollDelegate.$getByHandle('messageDetailsScroll');
        $scope.isInputText = true;
        $scope.msg = "";
        // console.log("enter");
        $scope.doRefresh = function () {
          // console.log("ok");
          $scope.messageNum += 5;
          $timeout(function () {
            $scope.messageDetils = messageService.getAmountMessageById($scope.messageNum,
                $stateParams.messageId);
            $scope.$broadcast('scroll.refreshComplete');
          }, 200);
        };

        $scope.$on("$ionicView.beforeEnter", function () {
          $scope.message = messageService.getMessageById($stateParams.messageId);
          $scope.message.noReadMessages = 0;
          $scope.message.showHints = false;
          messageService.updateMessage($scope.message);
          $scope.messageNum = 10;
          $scope.messageDetils = messageService.getAmountMessageById($scope.messageNum,
              $stateParams.messageId);
          $timeout(function () {
            viewScroll.scrollBottom();
          }, 0);
        });

        $scope.sendMsg = function() {
          var data = {};
          data.content = $scope.msg;
          data.isFromeMe = true;
          data.time = new Date();
          $scope.messageDetils.unshift(data);
          $scope.msg = '';
        };

        $scope.toggleInput = function (isInputText) {
          $scope.isInputText = !isInputText;
          console.log($scope.isInputText);
        };

        $scope.startRecord = function () {
          wxjs.run(function () {
            alert('startRecord');
            wx.startRecord();
          });
        };

        $scope.stopRecord = function () {
          alert('stopRecord');
          wx.stopRecord({
            success: function (res) {
              var localId = res.localId;
              alert(localId);
            }
          });
        };

        $scope.show = function () {
          // Show the action sheet
          var hideSheet = $ionicActionSheet.show({
            buttons: [
              {text: '<i class="ion-ios-camera icon-button icon-action" ></i>    <span class="tab-action"></span>     <i class="text-action">照片</i> '},
              {text: '<i class="ion-social-instagram icon-button icon-action" ></i>   <span class="tab-action"></span>        <i class="text-width">小视频</i> '},
              {text: '<i class="ion-ios-videocam icon-button icon-action" ></i>   <span class="tab-action"></span>        <i class="text-width">视频聊天</i> '},
              {text: '<i class="ion-ios-mic icon-button icon-action" ></i>    <span class="tab-action"></span>        <i class="text-width">语音输入</i> '},
              {text: '<i class="ion-ios-location icon-button icon-action" ></i>    <span class="tab-action"></span>        <i class="text-width">位置</i> '},
              {text: '<i class="ion-ios-eye icon-button icon-action" ></i>    <span class="tab-action"></span>        <i class="text-width">收藏</i> '},
              //{ text: '<i class="ion-more icon-button icon-action" ></i>               <span class="tab-action"></span>        <i class="text-width">More</i> ' },
            ],
            //destructiveText: 'Delete',
            //titleText: 'Modify your album',
            //cssClass: 'social-actionsheet',
            //cancelText: 'Cancel',
            //cancel: function() {
            //},
            buttonClicked: function (index) {
              alert(index);
              if (index == '3') {
              }
              return true;
            }
          });
          // For example's sake, hide the sheet after two seconds
          //me.$timeout(function() {
          //  hideSheet();
          //}, 2000);
        };


        window.addEventListener("native.keyboardshow", function (e) {
          viewScroll.scrollBottom();
        });


      }
    ])
