(function() {
    'use strict';
    
    angular.module('myApp')
    .service('firebaseService', firebaseService);

firebaseService.$inject = ['$firebaseArray'];


 function firebaseService($firebaseArray) {

    var songsRef = firebase.database().ref().child("songlist");
    var playListRef = firebase.database().ref().child("playlist");
    
    this.songsRef = songsRef;
    this.playListRef = playListRef;

    this.fetchSongs = function () {
        return $firebaseArray(songsRef);
    }

    this.fetchPlayList = function () {
        return $firebaseArray(playListRef);
    }
 }

})();