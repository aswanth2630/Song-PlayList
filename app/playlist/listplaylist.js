'use strict';

angular.module('myApp.listplaylist', ['ngRoute','ngScrollbars'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/playlist', {
    templateUrl: 'playlist/listplaylist.html',
    controller: 'listplaylistCtrl'
  });
}])

.controller('listplaylistCtrl', ['$scope','$firebaseArray','$location',function($scope,$firebaseArray,$location) {

    var playref = firebase.database().ref().child("playlist");
    var songref = firebase.database().ref().child("songlist");

    $scope.playlist = $firebaseArray(playref);
    $scope.songs = $firebaseArray(songref);
    $scope.showPlaylist = false;
    var currentId = null;

    $scope.showAddform = false;
    $scope.showTotalList = true;
    $scope.showAddPlaylistDetail = true;
    $scope.showAddSongButton = true;
    $scope.songDatabase = false;
    $scope.showEditForm = false;
    $scope.addFlag = false;

    $scope.searchSong = '';
    var playlistId = null;
    var playname = null;

    $scope.addPlay = function(){
      $scope.showAddform = true;
      $scope.showTotalList = false;
    }

    $scope.resetPlaylistForm = function(){
      $scope.playlistName = '';
      $scope.playlistDescription = '';
    }

    $scope.submitChanges = function(){

    }
    $scope.gotoPage= function(paths){
      $location.path(paths);
    }
 $scope.addPlaylist = function(){
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
    $scope.showAddform = false;
    $scope.showAddSongButton = false;
    $scope.addFlag = true;

    swal("Good job!", "You created the playlist!", "success");
  }

  //get the current playlist details
      playref.on("value",function(snapshot){
        snapshot.forEach(function(cs){
          if(cs.key === playlistId){
            $scope.currentPlaylistName = cs.val().playlistName;
            $scope.currentPlaylistDescription = cs.val().playlistDescription;
          }
          else if(cs.key === currentId){
            $scope.currentPlaylistName = cs.val().playlistName;
            $scope.currentPlaylistDescription = cs.val().playlistDescription;
          }
        });
      });

    $scope.removeSong = function(song){
      var count = 0;
      var refSongsinPlaylist = playref.child(currentId+'/songs');
      refSongsinPlaylist.once("value").then(function(snap){
        snap.forEach(function(cs){
          if(count === song){
            cs.getRef().remove();
            $scope.songsAddedtoPlayList.splice(song,1);
            $scope.$apply();
          }
          count++;
        });
});
}

$scope.addSongtolist = function(){
  $scope.showAddform = false;
  $scope.showTotalList = false;
  $scope.songDatabase = true;
  $scope.showEditForm = false;

  $scope.addSongstoPlaylist();

}
// Adding songs to playlist

$scope.addSongstoPlaylist = function(ref){
  if($scope.addFlag === true){
    var refSongsinPlaylist = playref.child(playlistId+'/songs');
  }
  else{
    var refSongsinPlaylist = playref.child(currentId+'/songs');
  }
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
            swal(value.songName, "is added to  "+$scope.currentPlaylistName, "success");
        }
      });
  $scope.showAddSongButton = false;
});
});
}
    $scope.showSongsInThePlaylist = function(ref){
      $scope.showPlaylist = true;
      $scope.songsAddedtoPlayList = [];
      $scope.keyStorage = [];
      playref.once("value").then(function(snap){
        snap.forEach(function(cs){
          $scope.keyStorage.push(cs.key);
        });
        var refSongsinPlaylist = playref.child($scope.keyStorage[ref]+'/songs');
        currentId = $scope.keyStorage[ref];
        refSongsinPlaylist.once("value").then(function(sn){
          sn.forEach(function(childsnap){
            var childData = childsnap.val();
            angular.forEach($scope.songs, function(value, key) {
                if(value.$id === childData){
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
      });
    }
}]);
