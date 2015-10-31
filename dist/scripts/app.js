var blocJamsModule = angular.module('blocJams', ['ui.router']);

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
            controller: 'Album.controller',
            templateUrl: '/templates/album.html'
        })
        .state('landing',{
            url: '/landing',
            controller: 'Landing.controller',
            templateUrl: '/templates/landing.html'
        })
        .state('collection',{
            url: '/collection',
            controller: 'Collection.controller',
            templateUrl: '/templates/collection.html'    
        });
    
});