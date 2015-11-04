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
    $scope.currentSongName = null;
    $scope.currentSongNameMobile = null;
    
    // Problem: Why are these not updated when currentTime and socialTime are updated in their service? 
    $scope.currentTime = PlayerVariables.currentTime;
    $scope.totalTime = PlayerVariables.totalTime;
    
    $scope.showNumber = true;
    $scope.showPlay = false;
    $scope.showPause = false; 
    $scope.showPlayInBar = true;
    $scope.showPauseInBar = false;
    
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

            $scope.updatePlayerBarSong();
            
        } else if (PlayerVariables.currentlyPlayingSongNumber != songNumber) {
            SongPlayer.play(songNumber);
            
            // PROBLEM: How do I get rid of the previously clicked Pause-Button????
            // GENERAL Question: How do I use ng-show for a specific element that was part of ng-repeat?
            this.showNumber = false;
            this.showPlay = false;
            this.showPause = true;

            $scope.updatePlayerBarSong();
            
        } else if (PlayerVariables.currentlyPlayingSongNumber == songNumber) {
            if(PlayerVariables.currentSoundFile.isPaused()){
                SongPlayer.play(songNumber);
                this.showPause = true;
                this.showPlay = false; 
                $scope.updatePlayerBarSong();
            } else {
                SongPlayer.pause();
                this.showPlay = true; 
                this.showPause = false;
            }
        }
    };
    
    $scope.playSongFromBar = function() {
        
        if (PlayerVariables.currentSongFromAlbum === null) {
            SongPlayer.play(1);
            $scope.updatePlayerBarSong();
//          getSongNumberCell(currentlyPlayingSongNumber).html(pauseButtonTemplate);            
//          updateSeekBarWhileSongPlays();            
            
        } else if (PlayerVariables.currentSoundFile.isPaused()) {
            SongPlayer.play(PlayerVariables.currentlyPlayingSongNumber);
            $scope.updatePlayerBarSong();
//          getSongNumberCell(currentlyPlayingSongNumber).html(pauseButtonTemplate); 
            
        } else if (PlayerVariables.currentSoundFile) {
            SongPlayer.pause(PlayerVariables.currentlyPlayingSongNumber);
            $scope.updatePlayerBarSong();
//          getSongNumberCell(currentlyPlayingSongNumber).html(playButtonTemplate);
            
        }
    };
    
    $scope.updatePlayerBarSong = function(){
            $scope.currentSongName = PlayerVariables.currentSongFromAlbum.name;
            $scope.currentSongNameMobile = PlayerVariables.currentSongFromAlbum.name + " " + $scope.artist;
            // Problem 2: Why is this not working? I get no affect at all on the play button in the bar. 
            $scope.showPauseInBar = true ? false: true;    
            $scope.showPlayInBar = false ? true: false;
    };
    
    // ToDo: Two functions for the previous and next buttons
    $scope.playPreviousSong = function(){
        if(PlayerVariables.currentlyPlayingSongNumber === 1) {
            var previousSongNumber = $scope.songs.length;
        } else if (!PlayerVariables.currentlyPlayingSongNumber) {
            var previousSongNumber = 1; 
        } else {
            var previousSongNumber = PlayerVariables.currentlyPlayingSongNumber - 1; 
        }
        
        // Set the last song back to it's song number
//      oldCurrentSongNumberCell.html(currentlyPlayingSongNumber);
        
        // Update the current song variables
        SongPlayer.play(previousSongNumber);
//      updateSeekBarWhileSongPlays();
        
        // Set the play button for the previous song
//      var nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
//      nextSongNumberCell.html(pauseButtonTemplate);
        
        // Update the player
        $scope.updatePlayerBarSong();
    
    };

    $scope.playNextSong = function(){
        if(PlayerVariables.currentlyPlayingSongNumber < $scope.songs.length) {
            var nextSongNumber = PlayerVariables.currentlyPlayingSongNumber +1;  
        } else {
            var nextSongNumber = 1; 
        }
        // Set the last song back to it's song number
//      oldCurrentSongNumberCell.html(currentlyPlayingSongNumber);
        
        // Update the current song variables
        SongPlayer.play(nextSongNumber);
//      updateSeekBarWhileSongPlays();
        
        // Set the play button for the next song
//      var nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
//      nextSongNumberCell.html(pauseButtonTemplate);
        
        // Update the player
        $scope.updatePlayerBarSong();
    };
 
    // Assignment 6: Functions to update the time bar and the volume bar
    
}]);
    










