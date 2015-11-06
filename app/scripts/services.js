var blocJamsServices = angular.module('blocJamsServices', []);

blocJamsServices.service('PlayerVariables', function(){
    return {
        albumList: [albumPicasso, albumMarconi],
        clickedAlbum: null, 
        currentlyPlayingSongNumber: null,
        previousSongNumber: null,
        currentAlbum: null,
        currentSongFromAlbum: null,
        currentSoundFile: null,
        currentVolume: 80,
        currentTime: null,
        totalTime: null,
        seekPercentage: null,
        volumePercentage: null
    }
});   

blocJamsServices.service('SongPlayer', ['PlayerVariables', function(PlayerVariables, SetSong){
    return {
        
        setSong: function(songNumber){
            if (PlayerVariables.currentSoundFile){
                PlayerVariables.currentSoundFile.stop();
                PlayerVariables.previousSongNumber = PlayerVariables.currentlyPlayingSongNumber;
                }
            PlayerVariables.currentlyPlayingSongNumber = songNumber;
            PlayerVariables.currentSongFromAlbum = PlayerVariables.currentAlbum.songs[songNumber -1];
            PlayerVariables.currentSoundFile = new buzz.sound(PlayerVariables.currentSongFromAlbum.audioUrl, {
                formats: ['mp3'],
                preload: true,
            });
            this.setVolume(PlayerVariables.currentVolume);
        },
        
        setVolume: function(volume) {
            if(PlayerVariables.currentSoundFile){
                PlayerVariables.currentSoundFile.setVolume(volume);
             }
        },
        
        seek: function(time){
            if(PlayerVariables.currentSoundFile) {
                PlayerVariables.currentSoundFile.setTime(time);
                PlayerVariables.currentSoundFile.play();
            }
        },
        
        play: function(songNumber, $scope){
            this.setSong(songNumber);
            this.updateSeekBarWhileSongPlays(this.calculateSeekPercentage, $scope);
            PlayerVariables.currentSoundFile.play(); 
        },
        
        pause: function(){
            PlayerVariables.currentSoundFile.pause();
        },
        
        updateSeekBarWhileSongPlays: function(calculateSeekPercentage, $scope){
            if(PlayerVariables.currentSoundFile){
                PlayerVariables.currentSoundFile.bind('timeupdate', function(event){
                    var seekBarFillRatio = this.getTime() / this.getDuration();
                    
                    PlayerVariables.seekPercentage = calculateSeekPercentage(seekBarFillRatio);
                    
                    PlayerVariables.currentTime = buzz.toTimer(this.getTime());;  
                    PlayerVariables.totalTime = buzz.toTimer(this.getDuration());
    
                    $scope.$apply();
                });
            }            
        },
        
        calculateSeekPercentage: function(seekBarFillRatio){
            var offsetXPercent = seekBarFillRatio *100;
            offsetXPercent = Math.max(0, offsetXPercent);
            offsetXPercent = Math.min(100, offsetXPercent);
            var percentageString = Math.ceil(offsetXPercent) + '%';
        
            return percentageString;
        }
    }
}]);

