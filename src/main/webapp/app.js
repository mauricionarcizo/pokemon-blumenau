(function () {
    var app = angular.module('PokemonBlumenauApp', ['ngResource', 'timer']);
    app.controller('PokemonBlumenauController', PokemonBlumenauController);

    app.factory('PokemonService', function ($resource) {
        return $resource('http://localhost:8080/rest/hello');
    })

    app.factory('GoogleMapsAddressService', function ($resource) {
        return $resource('https://maps.googleapis.com/maps/api/geocode/json');
    })

    function PokemonBlumenauController($injector, $scope) {
        var vm = this;
        var PokemonService = $injector.get('PokemonService');
        var GoogleMapsAddressService = $injector.get('GoogleMapsAddressService');
        var $interval = $injector.get('$interval');
        var $timeout = $injector.get('$timeout');
        var lastId = 0;
        vm.listPokemon = [];
        vm.endTimePokemon = endTimePokemon;

        loadPokemon();

        $interval(function () {
            loadPokemon()
        }, 60000);

        function loadPokemon() {

            PokemonService.query({
                lastId: lastId
            })
                .$promise
                .then(function (data) {
                    angular.forEach(data, function (pokemon) {
                        var atk = pokemon.atk || 0;
                        var def = pokemon.def || 0;
                        var sta = pokemon.sta || 0;
                        pokemon.iv = (atk + def + sta) * 100 / 45;
                    });
                    var newList = data.filter(function (pokemon) {
                        return pokemon.iv > 80;
                    });
                    vm.listPokemon = vm.listPokemon.concat(newList);

                    angular.forEach(newList, function (pokemon) {
                        pokemon.address = 'Carregando localização';
                        pokemon.timer = pokemon.expires_at - new Date().getTime() / 1000;
                    });
                    loadPokemonAddress(newList, 0);
                    lastId = data[data.length - 1].id.split('-')[1];
                });
        }

        function loadPokemonAddress(pokemonList, index) {
            var poke = pokemonList[index];
            loadAddress(poke, true)
                .then(function () {
                    if (index + 1 < pokemonList.length) {
                        $timeout(function () {
                            loadPokemonAddress(pokemonList, index + 1);
                        }, 500);
                    }
                });
        }

        function loadAddress(pokemon, useKey) {
            var queryParams = { latlng: pokemon.lat + ',' + pokemon.lon };
            if (useKey) {
                queryParams.key = 'AIzaSyBhArMPqNkrs1kz2k18h5e3rbtGTo9QbsI';
            }
            return GoogleMapsAddressService.get(queryParams)
                .$promise.then(function (addresses) {
                    if (addresses.results[0]) {
                        pokemon.address = addresses.results[0].formatted_address;
                    } else {
                        if (addresses.error_message && useKey) {
                            loadAddress(pokemon, false);
                        } else {
                            pokemon.address = 'Não foi possível obter a localização.';
                        }
                    }
                })
                .catch(function () {
                    pokemon.address = 'Não foi possível obter a localização.';
                });
        }

        function endTimePokemon(pokemon, index) {
            vm.listPokemon = vm.listPokemon.filter(function (poke) { return poke.id != pokemon.id });
        }
    }
})();