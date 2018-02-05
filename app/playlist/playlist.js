'use strict';

angular.module('myApp.playlist', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/playlist1', {
    templateUrl: 'playlist/playlist.html',
    controller: 'playlistCtrl'
  });
}])


.controller('playlistCtrl', ['$scope','$firebaseArray',function($scope,$firebaseArray) {


    var playref = firebase.database().ref().child("playlist");
    var songref = firebase.database().ref().child("songlist");

    $scope.playlist = $firebaseArray(playref);
    $scope.songs = $firebaseArray(songref);

    $scope.showAddform = false;
    $scope.showAddSongButton = true;
    $scope.songDatabase = false;


    var playlistId = null;
    var playname = null;


 $scope.addPlaylist = function(){
    console.log("Adding Songs to database");

    $scope.playlist.$add({
      playlistName:$scope.playlistName,
      playlistDescription:$scope.playlistDescription,
    }).then(function(ref){
      playlistId = ref.key;
      playname = $scope.playlistName
      $scope.playlistName = '';
      $scope.playlistDescription = '';

    });
    $scope.songDatabase = true;
    $scope.showAddform = true;
    $scope.showAddSongButton = false;

  }

  $scope.addSongstoPlaylist = function(ref){

    var refSongsinPlaylist = playref.child(playlistId+'/songs');

    songref.on('value',function(snap){
        var key = Object.keys(snap.val())[ref];
        refSongsinPlaylist.push(key);
    });
    $scope.songsAddedtoPlayList = [];
    refSongsinPlaylist.once("value")
  .then(function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      var key = childSnapshot.key;
      var childData = childSnapshot.val();
      angular.forEach($scope.songs, function(value, key) {
          if(value.$id === childData){
            console.log("success" + value.songName);
            // Add song to a songsperplaylist  object
            var song = {};
              song["songName"] = value.songName;
              song["songArtist"] = value.songArtist;
              song["songDuration"] = value.songDuration;
              $scope.songsAddedtoPlayList.push(song);
              $scope.$apply();
          }
        });

  });
});

  }


}]);
