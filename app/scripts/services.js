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
        totalTime: null
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
        
        updateSeekBarWhileSongPlays: function(){
            if(PlayerVariables.currentSoundFile){
                PlayerVariables.currentSoundFile.bind('timeupdate', function(event){
                    var seekBarFillRatio = this.getTime() / this.getDuration();
//                  updateSeekPercentage($seekBar, seekBarFillRatio);
                    PlayerVariables.currentTime = buzz.toTimer(this.getTime());
                    PlayerVariables.totalTime = buzz.toTimer(this.getDuration());
                    console.log(PlayerVariables.totalTime);
                });
            }            
        }
    }
}]);

/////////////////


//var updateSeekPercentage = function($seekBar, seekBarFillRatio) {
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
//
//var setupSeekBars = function(){
//    var $seekBars = $('.player-bar .seek-bar');
//    
//    $seekBars.click(function(event){
//            var offsetX = event.pageX - $(this).offset().left;
//            var barWidth = $(this).width();
//            var seekBarFillRatio = offsetX / barWidth;
//        
//        if ($(this).parent().attr('class') == 'seek-control'){
//            seek(seekBarFillRatio * currentSoundFile.getDuration());
//        }  else {
//            setVolume(seekBarFillRatio * 100);
//        }
//        
//        updateSeekPercentage($(this), seekBarFillRatio);        
//    });
//    
//    $seekBars.find('.thumb').mousedown(function(event){
//        var $seekBar = $(this).parent();
//        
//        $(document).bind('mousemove.thumb', function(event){
//            var offsetX = event.pageX - $seekBar.offset().left;
//            var barWidth = $seekBar.width();
//            var seekBarFillRatio = offsetX / barWidth; 
//            
//            if ($(this).parent().attr('class') == 'seek-control'){
//            seek(seekBarFillRatio * currentSoundFile.getDuration());
//            }  else {
//            setVolume(seekBarFillRatio);
//            }
//            
//            updateSeekPercentage($seekBar, seekBarFillRatio);
//        });
//        
//        $(document).bind('mouseup.thumb', function() {
//            $(document).unbind('mousemove.thumb');
//            $(document).unbind('mouseup.thumb');
//        });
//    });
//};

//
//var filterTimeCode = function(timeInSeconds){
//    var float = parseFloat(timeInSeconds, 10);
//    var min = Math.floor(float / 60);
//    var sec = float - (min*60);
//    
//    if (min < 10) {min = '0' + min}
//    if (sec < 10) {sec = '0' + sec}
//    
//    return min + ':' + sec; 
//    
//};


//

//

