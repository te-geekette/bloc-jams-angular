var blocJamsServices = angular.module('blocJamsServices', []);

blocJamsServices.service('PlayerVariables', function(){
    return {
        currentlyPlayingSongNumber: null,
        previousSongNumber: null,
        currentAlbum: albumPicasso,
        currentSongFromAlbum: null,
        currentSoundFile: null,
        currentVolume: 80,
        currentTime: null,
        totalTime: null,
        seekPercentage: null
    }
});   

blocJamsServices.service('SongPlayer', ['PlayerVariables', function(PlayerVariables, SetSong){
    return {
        
        setSong: function(songNumber){
            if (PlayerVariables.currentSoundFile){
                PlayerVariables.currentSoundFile.stop();
                }
            PlayerVariables.currentlyPlayingSongNumber = songNumber;
            PlayerVariables.previousSongNumber = PlayerVariables.currentlyPlayingSongNumber;
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
            }
        },
        
        play: function(songNumber){
            this.setSong(songNumber);
            this.updateSeekBarWhileSongPlays();
            PlayerVariables.currentSoundFile.play();
            
        },
        
        pause: function(){
            PlayerVariables.currentSoundFile.pause();
        },
        
        updateSeekBarWhileSongPlays: function(calculateSeekPercentage){
            if(PlayerVariables.currentSoundFile){
                PlayerVariables.currentSoundFile.bind('timeupdate', function(event){
                    var seekBarFillRatio = this.getTime() / this.getDuration();
                    
                    // Problem: How do I properly get calculateSeekPercentage into the binding?
                    PlayerVariables.seekPercentage = calculateSeekPercentage(seekBarFillRatio);
                    PlayerVariables.currentTime = buzz.toTimer(this.getTime());
                    PlayerVariables.totalTime = buzz.toTimer(this.getDuration());
                    console.log(PlayerVariables.seekPercentage);
                });
                
            }            
        },
        
        calculateSeekPercentage: function(seekBarFillRatio){
            var offsetXPercent = seekBarFillRatio *100;
            offsetXPercent = Math.max(0, offsetXPercent);
            offsetXPercent = Math.min(100, offsetXPercent);
            var percentageString = '"' + offsetXPercent + '%' + '"';
            console.log(percentageString);
            return percentageString;
        }
        
//    var updateSeekPercentage = function($seekBar, seekBarFillRatio) {
//    var offsetXPercent = seekBarFillRatio * 100;
//
//    offsetXPercent = Math.max(0, offsetXPercent);
//    offsetXPercent = Math.min(100, offsetXPercent);
// 
//    var percentageString = offsetXPercent + '%';
    
//    $seekBar.find('.fill').width(percentageString);
//    $seekBar.find('.thumb').css({left: percentageString});
// };
//
    }
}]);

