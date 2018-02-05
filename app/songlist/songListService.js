var SongService = angular.module('SongService', [])
StudentService.factory('StudentDataOp', ['$http', function ($http) {

    var ref = firebase.database().ref().child("songlist");
    var StudentDataOp = {};

    StudentDataOp.getSongs = function () {
        return $http.get(ref+'/ListSongs');
    };

    StudentDataOp.addSong = function (song) {
        return $http.post(ref + '/AddSongs', song);
    };
    return StudentDataOp;

}]);
