(function () {
    'use strict';
    var app = angular.module('PokemonBlumenauApp', [
        'ui.bootstrap',
        'ngResource',
        'ngAnimate',
        'timer',
        'ngTable',
        'ngSanitize',
        'ngTouch']);

    app.factory('PokemonService', function ($resource) {
        return $resource('http://localhost:8080/rest/pokemon');
    });

    app.factory('GoogleMapsAddressService', function ($resource) {
        return $resource('https://maps.googleapis.com/maps/api/geocode/json');
    });

    app.factory('PokemonListService', function ($resource) {
        return $resource('https://gist.githubusercontent.com/mauricionarcizo/69b2272fc199c1171aab47e6176801c6/raw/ac0b52e67d485373015b839345e55aeac384adad/pokemon-go-list.json');
    });

    app.controller('AppController', AppController);

    function AppController() {
        var vm = this;

        vm.selectListPokemon = selectListPokemon;
        vm.selectFilterPokemon = selectFilterPokemon;

        function selectListPokemon() {
            console.log('selectListPokemon')
        }

        function selectFilterPokemon() {
            console.log('selectFilterPokemon')
        }
    }
})();