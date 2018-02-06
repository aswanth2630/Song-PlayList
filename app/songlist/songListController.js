'use strict';

angular.module('myApp.songList', ['ngRoute'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/songlist', {
      templateUrl: 'songlist/songList.html',
      controller: 'songListController'
    });
  }])


  .controller('songListController', ['$scope', 'firebaseService', function ($scope, firebaseService) {

    $scope.songs = firebaseService.fetchSongs();

    $scope.showEditForm = false;
    $scope.showAddform = false;
    $scope.showSongTable = true;
    $scope.searchSong = '';

    $scope.showEditSongs = function (song) {
      $scope.showEditForm = true;
      $scope.showAddform = false;
      $scope.showSongTable = false;
      $scope.id = song.$id;
      $scope.songName = song.songName;
      $scope.songArtist = song.songArtist;
      $scope.songDuration = song.songDuration;
    }

    $scope.resetSongForm = clearSong();

    $scope.showAddSongsForm = function () {
      $scope.showEditForm = false;
      $scope.showAddform = true;
      $scope.showSongTable = false;
      clearSong();
    }

    $scope.addSongs = function () {
      console.log("Adding Songs to database");

      $scope.songs.$add({
        songName: $scope.songName,
        songArtist: $scope.songArtist,
        songDuration: $scope.songDuration
      }).then(function (ref) {
        var songId = ref.key;
        console.log("song id is  " + songId);
        clearSong();
      });
      swal("Good job!", "You created the song!", "success");
      $scope.showAddform = false;
      $scope.showSongTable = true;
    }

    $scope.removeSong = function (song) {
      $scope.songs.$remove(song);
      swal(song.songName, "is deleted from the database!", "success");
    }

    $scope.editSong = function () {
      $scope.showAddform = false;
      var id = $scope.id;

      var record = $scope.songs.$getRecord(id);

      record.songName = $scope.songName;
      record.songArtist = $scope.songArtist;
      record.songDuration = $scope.songDuration;

      $scope.songs.$save(record).then(function (ref) {
        console.log(ref.key);
      });
      clearSong();
      swal(record.songName, "is modified!", "success");
      $scope.showEditForm = false;
      $scope.showSongTable = true;
    }

    function clearSong() {
      $scope.songName = '';
      $scope.songArtist = '';
      $scope.songDuration = '';
    }

  }]);
