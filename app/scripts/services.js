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
        
        // PROBLEM: How can I get this to update constantly? 
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
            }
        },
        
        play: function(songNumber){
            this.setSong(songNumber);
            this.updateSeekBarWhileSongPlays(this.calculateSeekPercentage);
            PlayerVariables.currentSoundFile.play();
            
        },
        
        pause: function(){
            PlayerVariables.currentSoundFile.pause();
        },
        
        updateSeekBarWhileSongPlays: function(calculateSeekPercentage){
            if(PlayerVariables.currentSoundFile){
                PlayerVariables.currentSoundFile.bind('timeupdate', function(event){
                    var seekBarFillRatio = this.getTime() / this.getDuration();
                    
                    // Problem: Why is the seekPercentage variable not updating the view??
                    PlayerVariables.seekPercentage = calculateSeekPercentage(seekBarFillRatio);
                    // Problem: How do I make sure that only the time seek bar is updated but not the volume one? 
                    
                    // Problem: Why are the time variables not updated in the view??
                    PlayerVariables.currentTime = buzz.toTimer(this.getTime());;  
                    PlayerVariables.totalTime = buzz.toTimer(this.getDuration());
                    
                    // The log shows that both variables are changing constantly. Only the view doesn't react properly. 
                    console.log(PlayerVariables.seekPercentage, PlayerVariables.currentTime);
                });
                
            }            
        },
        
        calculateSeekPercentage: function(seekBarFillRatio){
            var offsetXPercent = seekBarFillRatio *100;
            offsetXPercent = Math.max(0, offsetXPercent);
            offsetXPercent = Math.min(100, offsetXPercent);
            var percentageString = offsetXPercent + '%';
        
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

