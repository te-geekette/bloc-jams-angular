var blocJamsModule = angular.module('blocJams', ['ui.router', 'blocJamsServices']);

// configuring the providers we'll need. In this case for state behaviour und URL handling
blocJamsModule.config(function($stateProvider, $locationProvider){
    
    // standard config, makes sure the URL is shown without a hashbang #!
    $locationProvider.html5Mode({
        enable: true,
        requireBase: false,
    });
    
    // defining the necessary states and their aspects 
    $stateProvider
        .state('album', {
            url: '/album',
            controller: 'AlbumController',
            templateUrl: '/templates/album.html'
        })
        .state('landing',{
            url: '/landing',
            controller: 'LandingController',
            templateUrl: '/templates/landing.html'
        })
        .state('collection',{
            url: '/collection',
            controller: 'CollectionController',
            templateUrl: '/templates/collection.html'    
        });
    
});

blocJamsModule.controller('LandingController', ['$scope',function($scope){
    $scope.tagline = "Turn the music up!";
}]);

blocJamsModule.controller('CollectionController', ['$scope', function($scope){
    $scope.albumList = [albumPicasso, albumMarconi];
    for ( var i = 0; i <= 4; i++ ) {
        $scope.albumList.push(angular.copy(albumPicasso));
        $scope.albumList.push(angular.copy(albumMarconi));
    } 
}]);

blocJamsModule.controller('AlbumController', ['$scope', 'SongPlayer', 'PlayerVariables', function($scope, SongPlayer, PlayerVariables){
    
    $scope.name = albumPicasso.name;
    $scope.artist = albumPicasso.artist;
    $scope.yearLabel = albumPicasso.year + " " + albumPicasso.label;
    $scope.albumArtUrl = albumPicasso.albumArtUrl;
    $scope.songs = albumPicasso.songs;
    
    $scope.showNumber = true;
    $scope.showPlay = false;
    $scope.showPause = false; 
    
    // Two functions to show the playButton when user hovers over a row
    $scope.showPlayButton = function(){
        if(this.showPause == !true) {
            this.showNumber = false;
            this.showPlay = true;   }
    };
    
    $scope.hidePlayButton = function(){
        if(this.showPause == !true) {
            this.showNumber = true;
            this.showPlay = false;  }
    };
    
    // One function to play the song when user clicks a play button in the rows
    $scope.playPauseSong = function(song){
        var songNumber = $scope.songs.indexOf(song)+1;
        
        if (PlayerVariables.currentlyPlayingSongNumber == null){
            SongPlayer.play(songNumber);
            this.showNumber = false;
            this.showPlay = false; 
            this.showPause = true;
            
        } else if (PlayerVariables.currentlyPlayingSongNumber != songNumber) {
            SongPlayer.play(songNumber);
            
            // PROBLEM: How do I get rid of the previously clicked Play-Button????
            this.showNumber = false;
            this.showPlay = false;
            this.showPause = true;
            
        } else if (PlayerVariables.currentlyPlayingSongNumber == songNumber) {
            if(PlayerVariables.currentSoundFile.isPaused()){
                SongPlayer.play(songNumber);
                this.showPause = true;
                this.showPlay = false; 
            } else {
                SongPlayer.pause();
                this.showPlay = true; 
                this.showPause = false;
            }
        }
        

        
    };
    
    // ToDo: Two functions for the previous and next buttons
    $scope.playPreviousSong = function(){};
    $scope.playNextSong = function(){};
    
    // ToDo: Functions to update the time bar and the volume bar
    
}]);
    









