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

// Problem: Not really working yet. I guess something with the pageYOffset is wrong
blocJamsModule.directive('scrollLanding', function($window){
    return {
        restrict: 'A',
        link: function (scope, element, attrs){
            angular.element($window).bind('scroll', function(){
                if(this.pageYOffset >= 10) {
                    scope.reveal = true;
                } else {
                    scope.reveal = false;
                }
                scope.$apply();
            });
        }
    }
});

blocJamsModule.controller('CollectionController', ['$scope', 'PlayerVariables', function($scope, PlayerVariables){
    $scope.albumList = PlayerVariables.albumList;
    for ( var i = 0; i <= 4; i++ ) {
        $scope.albumList.push(angular.copy(albumPicasso));
        $scope.albumList.push(angular.copy(albumMarconi));
    } 
    $scope.updateSelectedAlbum = function(album){
        PlayerVariables.currentAlbum = album; 
        console.log(PlayerVariables.currentAlbum);
    };
}]);

blocJamsModule.controller('AlbumController', ['$scope', 'SongPlayer', 'PlayerVariables', function($scope, SongPlayer, PlayerVariables){
    
    $scope.name = PlayerVariables.currentAlbum.name;
    $scope.artist = PlayerVariables.currentAlbum.artist;
    $scope.yearLabel = PlayerVariables.currentAlbum.year + " " + PlayerVariables.currentAlbum.label;
    $scope.albumArtUrl = PlayerVariables.currentAlbum.albumArtUrl;
    $scope.songs = PlayerVariables.currentAlbum.songs;
    
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
            SongPlayer.play(songNumber, $scope);
            PlayerVariables.volumePercentage = SongPlayer.calculateSeekPercentage(PlayerVariables.currentVolume / 100);
            console.log(PlayerVariables.volumePercentage);
            song.showNumber = false;
            song.showPlay = false; 
            song.showPause = true;
 
        } else if (PlayerVariables.currentlyPlayingSongNumber != songNumber) {
            SongPlayer.play(songNumber, $scope);
            this.updateSongButtons(PlayerVariables.previousSongNumber-1, true, false, false);          
            
            song.showNumber = false;
            song.showPlay = false;
            song.showPause = true;

        } else if (PlayerVariables.currentlyPlayingSongNumber == songNumber) {
            if(PlayerVariables.currentSoundFile.isPaused()){
                PlayerVariables.currentSoundFile.play();
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
            SongPlayer.play(1, $scope);
            this.updateSongButtons(PlayerVariables.currentlyPlayingSongNumber-1, false, false, true);
            PlayerVariables.volumePercentage = SongPlayer.calculateSeekPercentage(PlayerVariables.currentVolume / 100);
            
            SongPlayer.updateSeekBarWhileSongPlays(SongPlayer.calculateSeekPercentage, $scope);            
            
        } else if (PlayerVariables.currentSoundFile.isPaused()) {
            PlayerVariables.currentSoundFile.play();
            this.updateSongButtons(PlayerVariables.currentlyPlayingSongNumber-1, false, false, true);          
            
        } else if (PlayerVariables.currentSoundFile) {
            SongPlayer.pause(PlayerVariables.currentlyPlayingSongNumber);
            this.updateSongButtons(PlayerVariables.currentlyPlayingSongNumber-1, false, true, false);          
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
           
        // Update the current song variables
        SongPlayer.play(previousSongNumber, $scope);
//        SongPlayer.updateSeekBarWhileSongPlays(,$scope);
        
        // Set the last song back to it's song number
        if(PlayerVariables.previousSongNumber){
            this.updateSongButtons(PlayerVariables.previousSongNumber -1, true, false, false);
        }
        
        // Set the play button for the previous song
        this.updateSongButtons(previousSongNumber-1, false, false, true);
    };

    $scope.playNextSong = function(){
        if(PlayerVariables.currentlyPlayingSongNumber < $scope.songs.length) {
            var nextSongNumber = PlayerVariables.currentlyPlayingSongNumber +1;  
        } else {
            var nextSongNumber = 1; 
        }

        // Update the current song variables
        SongPlayer.play(nextSongNumber, $scope);        
        
        // Set the last song back to it's song number
        if(PlayerVariables.previousSongNumber){
            this.updateSongButtons(PlayerVariables.previousSongNumber -1, true, false, false);
        }
        // Set the play button for the next song
        this.updateSongButtons(nextSongNumber-1, false, false, true);

    };
    
    $scope.updateSongButtons = function(songIndex, numberBoolean, playBoolean, pauseBoolean){
        $scope.songs[songIndex].showNumber = numberBoolean;
        $scope.songs[songIndex].showPlay = playBoolean;
        $scope.songs[songIndex].showPause = pauseBoolean;
    };
 

    
}]);
    
blocJamsModule.directive('mySlider', ['SongPlayer', 'PlayerVariables' , function(SongPlayer, PlayerVariables){
    return {
        templateUrl: '/templates/seek.html',
        restrict: 'E',
        replace: true,
        link: function(scope, element, attribute){ 
            
            scope.onClick = function($event){
                var offsetX = $event.offsetX - $event.target.offsetLeft;
                var barWidth = $event.target.offsetWidth;
                var seekBarFillRatio = offsetX / barWidth;
                
                SongPlayer.seek(seekBarFillRatio * PlayerVariables.currentSoundFile.getDuration() );
                PlayerVariables.currentSongFromAlbum.showNumber = false;
                PlayerVariables.currentSongFromAlbum.showPlay = false;
                PlayerVariables.currentSongFromAlbum.showPause = true;
                
                PlayerVariables.seekPercentage = SongPlayer.calculateSeekPercentage(seekBarFillRatio);
            };
            
            scope.onMouseDown = function($event){
                                
                $event.target.bind('mousemove.thumb', function($event){
                    var offsetX = $event.offsetX - $event.target.offsetLeft;
                    var barWidth = $event.target.offsetWidth;
                    var seekBarFillRatio = offsetX / barWidth;
                    
                    SongPlayer.seek(seekBarFillRatio * PlayerVariables.currentSoundFile.getDuration() );
                    PlayerVariables.seekPercentage = SongPlayer.calculateSeekPercentage(seekBarFillRatio);
                    scope.$apply();
                });
                            
                $event.target.bind('mouseup.thumb', function(){
                    $event.target.unbind('mousemove.thumb');
                    $event.target.unbind('mouseup.thumb');
                    scope.$apply();
                });
            
            };                
        }
    }
}]);

blocJamsModule.directive('myVolumeSlider', ['SongPlayer', 'PlayerVariables' , function(SongPlayer, PlayerVariables){
    return {
        templateUrl: '/templates/seekVolume.html',
        restrict: 'E',
        replace: true,
        link: function(scope, element, attribute){ 
            
            scope.onClickV = function($event){
                var barWidth = $event.target.offsetWidth;
                var seekBarFillRatio = $event.offsetX / barWidth;

                SongPlayer.setVolume(seekBarFillRatio *100);
                PlayerVariables.volumePercentage = SongPlayer.calculateSeekPercentage(seekBarFillRatio);
                
            };
            
            scope.onMouseDownV = function($event){
                                
                $event.target.bind('mousemove.thumb', function($event){
                    var barWidth = $event.target.offsetWidth;
                    var seekBarFillRatio = $event.offsetX / barWidth;
                    
                    SongPlayer.setVolume(seekBarFillRatio *100);
                    PlayerVariables.volumePercentage = SongPlayer.calculateSeekPercentage(seekBarFillRatio);
                    scope.$apply();
                });
                            
                $event.target.bind('mouseup.thumb', function(){
                    $event.target.unbind('mousemove.thumb');
                    $event.target.unbind('mouseup.thumb');
                    scope.$apply();
                });
            
            };                
        }
    }
}]);


blocJamsModule.filter("timeFormat", function(){
    return function(timeinseconds){
        var float = parseFloat(timeinseconds, 10);
        var min = Math.floor(float / 60);
        var sec = float - (min*60); 
        
        if (min < 10) {min = '0' + min}
        if (sec < 10) {sec = '0' + sec}
        
        return min + ':' + sec;
    }
});










