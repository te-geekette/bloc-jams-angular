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
    
    $scope.PlayerVariables = PlayerVariables;
    
    $scope.showPauseInBar = false;
    $scope.togglePlayButtonInBar = function(){
        if (PlayerVariables.currentSoundFile && PlayerVariables.currentSoundFile.isPaused() === false){
            $scope.showPauseInBar = true;
            return false;
        } else {
            $scope.showPauseInBar = false;
            return true; 
        }
    };
    
    // Two functions to show the playButton when user hovers over a row
    $scope.showPlayButton = function(song){
        if(song.showPause == !true) {
            song.showNumber = false;
            song.showPlay = true;   }
    };
    
    $scope.hidePlayButton = function(song){
        if(song.showPause == !true) {
            song.showNumber = true;
            song.showPlay = false;  }
    };
    
    // One function to play the song when user clicks a play button in the rows
    $scope.playPauseSong = function(song){
        
        var songNumber = $scope.songs.indexOf(song)+1;

        if (PlayerVariables.currentlyPlayingSongNumber == null){
            SongPlayer.play(songNumber);
            song.showNumber = false;
            song.showPlay = false; 
            song.showPause = true;
 
        } else if (PlayerVariables.currentlyPlayingSongNumber != songNumber) {
            SongPlayer.play(songNumber);
            $scope.songs[PlayerVariables.previousSongNumber-1].showNumber = true;
            $scope.songs[PlayerVariables.previousSongNumber-1].showPlay = false;
            $scope.songs[PlayerVariables.previousSongNumber-1].showPause = false;
            
            song.showNumber = false;
            song.showPlay = false;
            song.showPause = true;

        } else if (PlayerVariables.currentlyPlayingSongNumber == songNumber) {
            if(PlayerVariables.currentSoundFile.isPaused()){
                SongPlayer.play(songNumber);
                song.showPause = true;
                song.showPlay = false; 
            } else {
                SongPlayer.pause();
                song.showPlay = true; 
                song.showPause = false;
            }
        }
    };
    
    $scope.playSongFromBar = function() {
        
        if (PlayerVariables.currentSongFromAlbum === null) {
            SongPlayer.play(1);
            $scope.songs[PlayerVariables.currentlyPlayingSongNumber-1].showNumber = false;
            $scope.songs[PlayerVariables.currentlyPlayingSongNumber-1].showPlay = false;
            $scope.songs[PlayerVariables.currentlyPlayingSongNumber-1].showPause = true;
            
            SongPlayer.updateSeekBarWhileSongPlays();            
            
        } else if (PlayerVariables.currentSoundFile.isPaused()) {
            SongPlayer.play(PlayerVariables.currentlyPlayingSongNumber);
            $scope.songs[PlayerVariables.currentlyPlayingSongNumber-1].showNumber = false;
            $scope.songs[PlayerVariables.currentlyPlayingSongNumber-1].showPlay = false;
            $scope.songs[PlayerVariables.currentlyPlayingSongNumber-1].showPause = true;
            
        } else if (PlayerVariables.currentSoundFile) {
            SongPlayer.pause(PlayerVariables.currentlyPlayingSongNumber);
            $scope.songs[PlayerVariables.currentlyPlayingSongNumber-1].showNumber = false;
            $scope.songs[PlayerVariables.currentlyPlayingSongNumber-1].showPlay = true;
            $scope.songs[PlayerVariables.currentlyPlayingSongNumber-1].showPause = false;            
        }
        $scope.togglePlayButtonInBar();
    };
  
    // Two functions for the previous and next buttons
    $scope.playPreviousSong = function(){
        
        if(PlayerVariables.currentlyPlayingSongNumber === 1) {
            var previousSongNumber = $scope.songs.length;
        } else if (!PlayerVariables.currentlyPlayingSongNumber) {
            var previousSongNumber = 1; 
        } else {
            var previousSongNumber = PlayerVariables.currentlyPlayingSongNumber - 1; 
        }
        
        // Set the last song back to it's song number
        if(PlayerVariables.previousSongNumber){
            $scope.songs[PlayerVariables.previousSongNumber -1].showNumber = true;
            $scope.songs[PlayerVariables.previousSongNumber -1].showPlay = false;
            $scope.songs[PlayerVariables.previousSongNumber -1].showPause = false;
        }
        
        // Update the current song variables
        SongPlayer.play(previousSongNumber);
        SongPlayer.updateSeekBarWhileSongPlays();
        
        // Set the play button for the previous song
        $scope.songs[previousSongNumber-1].showNumber = false;
        $scope.songs[previousSongNumber-1].showPlay = false;
        $scope.songs[previousSongNumber-1].showPause = true;
    
    };

    $scope.playNextSong = function(){
        if(PlayerVariables.currentlyPlayingSongNumber < $scope.songs.length) {
            var nextSongNumber = PlayerVariables.currentlyPlayingSongNumber +1;  
        } else {
            var nextSongNumber = 1; 
        }
        // Set the last song back to it's song number
        if(PlayerVariables.previousSongNumber){
            $scope.songs[PlayerVariables.previousSongNumber -1].showNumber = true;
            $scope.songs[PlayerVariables.previousSongNumber -1].showPlay = false;
            $scope.songs[PlayerVariables.previousSongNumber -1].showPause = false;
        }
        // Update the current song variables
        SongPlayer.play(nextSongNumber);        
        
        // Set the play button for the next song
        $scope.songs[nextSongNumber-1].showNumber = false;
        $scope.songs[nextSongNumber-1].showPlay = false;
        $scope.songs[nextSongNumber-1].showPause = true;

    };
 
    // Assignment 6: Functions to update the seek bars 
    
}]);
    










