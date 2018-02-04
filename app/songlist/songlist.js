'use strict';

angular.module('myApp.songlist', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/songlist', {
    templateUrl: 'songlist/songlist.html',
    controller: 'songlistCtrl'
  });
}])

.controller('songlistCtrl', ['$scope','$firebaseArray',function($scope,$firebaseArray) {


    var ref = firebase.database().ref().child("songlist");
    //console.log("aa "+ref)
    $scope.songs = $firebaseArray(ref);
    $scope.showEditForm = false;
    $scope.showAddform = false;

  //console.log("aa "+ref.child(ref.key));

    $scope.showEditSongs = function(song){
      $scope.showEditForm = true;
      $scope.showAddform = false;
      $scope.id = song.$id;
      $scope.songName = song.songName;
      $scope.songArtist = song.songArtist;
      $scope.songDuration = song.songDuration;
    }


$scope.showAddSongsForm = function(){
  $scope.showEditForm = false;
  $scope.showAddform = true;
  $scope.songName = '';
  $scope.songArtist = '';
  $scope.songDuration = '';
}
/*
function userExistsCallback(userId, exists) {
  if (exists) {
    alert('user ' + userId + ' exists!');
  } else {
    alert('user ' + userId + ' does not exist!');
  }
}

// Tests to see if /users/<userId> has any data.
function checkIfUserExists(userId) {

    userExistsCallback(userId, exists);
  });
}
*/
 $scope.addSongs = function(){
    console.log("Adding Songs to database");
/*
angular.forEach($scope.songs, function(value, key) {
    //console.log(value, key);
    if(value.songName === $scope.songName){

    }
  });*/
    $scope.songs.$add({
      songName:$scope.songName,
      songArtist:$scope.songArtist,
      songDuration:$scope.songDuration
    }).then(function(ref){
      var songId = ref.key;
      console.log("song id is  "+ songId);

      $scope.songName = '';
      $scope.songArtist = '';
      $scope.songDuration = '';
    });
    $scope.showAddform = false;
  }

  $scope.removeSong = function(song){
    $scope.songs.$remove(song);
  }

  $scope.editSong = function(){
    $scope.showAddform = false;
    var id = $scope.id;

    var record = $scope.songs.$getRecord(id);

    record.songName = $scope.songName;
    record.songArtist = $scope.songArtist;
    record.songDuration = $scope.songDuration;

    $scope.songs.$save(record).then(function(ref){
      console.log(ref.key);
    });
    $scope.songName = '';
    $scope.songArtist = '';
    $scope.songDuration = '';
    $scope.showEditForm = false;
  }

}]);
