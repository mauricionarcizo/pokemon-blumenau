(function () {
    'use strict';
    var app = angular.module('PokemonBlumenauApp', [
        'ui.bootstrap',
        'ngResource',
        'ngAnimate',
        'ngTable',
        'ngSanitize',
        'ngTouch',
        'TimerCountdown',
        'ui.utils.masks']);

    app.factory('PokemonService', function ($resource) {
        return $resource('/rest/pokemon');
    });

    app.factory('GoogleMapsAddressService', function ($resource) {
        return $resource('https://maps.googleapis.com/maps/api/geocode/json');
    });

    app.factory('OpenStreetMapAddressService', function ($resource) {
        return $resource('http://nominatim.openstreetmap.org/reverse?format=json&addressdetails=1');
    });

    app.factory('PokemonListService', function ($resource) {
        return $resource('https://gist.githubusercontent.com/mauricionarcizo/01da48654bd10a440b6c3189656557ff/raw/0ff07312a291a7b717921d273e6f2a839ab9a5f3/pokemon-go-list.min.json');
    });

    app.controller('AppController', AppController);

    function AppController() {
        var vm = this;

        vm.selectListPokemon = selectListPokemon;
        vm.selectFilterPokemon = selectFilterPokemon;

        init();

        function init() {
            createListPokemonFilter();
        }

        function createListPokemonFilter() {
            if (!localStorage.getItem('pokemon-bnu-1')) {
                for (var id = 1; id <= 386; id++) {
                    localStorage.setItem('pokemon-bnu-' + id, angular.toJson({ id: id, show: true, ivMin: 80, lvlMin: 20 }));
                }
            }
        }

        function selectListPokemon() {
            console.log('selectListPokemon')
        }

        function selectFilterPokemon() {
            console.log('selectFilterPokemon')
        }

    }
})();