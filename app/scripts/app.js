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

blocJamsModule.controller('AlbumController', ['$scope', 'SongNumberCell' ,'SongPlayer', function($scope, SongPlayer, SongNumberCell){
    $scope.name = albumPicasso.name;
    $scope.artist = albumPicasso.artist;
    $scope.yearLabel = albumPicasso.year + " " + albumPicasso.label;
    $scope.albumArtUrl = albumPicasso.albumArtUrl;
    $scope.songs = albumPicasso.songs;
    
    
    // Two functions to show the playButton when user hovers over a row
    // TODO: Check if song is already playing > don't hide playButton
    
    $scope.showPlayButton = function(){
        SongNumberCell.cellContent = '<a class="album-song-button"><span class="ion-play"></span></a>'; 
    };
    $scope.hidePlayButton = function(){
        SongNumberCell.cellContent = 'songs.length(song)';

    };
    
    // TODO: One function to play the song when user clicks on a row 
    // Note: playPauseSonge should also change the play button in the player bar 
    $scope.playPauseSong = function(){
        SongNumberCell.cellContent = '<a class="album-song-button"><span class="ion-pause"></span></a>';

        
    };
    
    // ToDo: Two functions for the previous and next buttons
    $scope.playPreviousSong = function(){};
    $scope.playNextSong = function(){};
    
    // ToDo: Two functions to update the time bar and the volume bar
    
}]);
    









