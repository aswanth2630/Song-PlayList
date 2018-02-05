'use strict';

angular.module('myApp.listplaylist', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/playlist', {
    templateUrl: 'playlist/listplaylist.html',
    controller: 'listplaylistCtrl'
  });
}])

.controller('listplaylistCtrl', ['$scope','$firebaseArray',function($scope,$firebaseArray) {
console.log("aass");

    var playref = firebase.database().ref().child("playlist");
    var songref = firebase.database().ref().child("songlist");

    $scope.playlist = $firebaseArray(playref);
    $scope.songs = $firebaseArray(songref);
    $scope.showPlaylist = false;
    var currentId = null;

    $scope.removeSong = function(song){
      var count = 0;
      var refSongsinPlaylist = playref.child(currentId+'/songs');
      refSongsinPlaylist.once("value").then(function(snap){
        snap.forEach(function(cs){
          if(count === song){
            cs.getRef().remove();
          $scope.refresh();
          }
          count++;
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



              // Add song to a songsperplaylist  object
            /*  var song = {};
                song["songName"] = value.songName;
                song["songArtist"] = value.songArtist;
                song["songDuration"] = value.songDuration;
                $scope.songsAddedtoPlayList.push(song);
                $scope.$apply();
                */
      /*      }
          });
    });
  });
*/
    }

    //console.log("aaa "+ $firebaseArray(songref));
/*  //  $scope.showEditForm = false;
    $scope.showAddform = false;
    $scope.showAddSongButton = true;
    $scope.songDatabase = false;

    var songsAddedtoPlayList = [];

    var playlistId = null;
    var playname = null;


 $scope.addPlaylist = function(){
    console.log("Adding Songs to database");

    $scope.playlist.$add({
      playlistName:$scope.playlistName,
      playlistDescription:$scope.playlistDescription,
    }).then(function(ref){
      playlistId = ref.key;
      console.log(playlistId);
      playname = $scope.playlistName
      $scope.playlistName = '';
      $scope.playlistDescription = '';

    });
    $scope.showAddform = true;
    $scope.showAddSongButton = false;

  }

  $scope.songsAdd = function(){
    $scope.songDatabase = true;

  }

  $scope.addSongstoPlaylist = function(ref){

    var refSongsinPlaylist = playref.child(playlistId+'/songs');

    songref.on('value',function(snap){
        var key = Object.keys(snap.val())[ref];
        refSongsinPlaylist.push(key);
    });

    refSongsinPlaylist.once("value")
  .then(function(snapshot) {
    snapshot.forEach(function(childSnapshot) {

      var key = childSnapshot.key;
      var childData = childSnapshot.val();
      angular.forEach($scope.songs, function(value, key) {
          //console.log(value, key);
          if(value.$id === childData){
            console.log("success" + value.$id);
            // Add song to a songsperplaylist  object
          }
        });
  });
});

  }

*/
}]);
