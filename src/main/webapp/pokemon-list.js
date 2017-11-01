(function () {
    'use strict';

    var app = angular.module('PokemonBlumenauApp');

    app.component('pokemonList', {
        templateUrl: './pokemon-list.html',
        controller: PokemonListController,
        controllerAs: 'vm'
    });

    function PokemonListController($injector) {
        var vm = this;
        var PokemonService = $injector.get('PokemonService');
        var GoogleMapsAddressService = $injector.get('GoogleMapsAddressService');
        var NgTableParams = $injector.get('NgTableParams');
        var lastId = 0;
        vm.listPokemon = [];
        vm.endTimePokemon = endTimePokemon;
        vm.updateListPokemon = updateListPokemon;

        init();

        function init() {
            vm.nextUpdate = moment().add(60, 's');
            vm.isLoading = true;
            loadPokemon()
                .then(function () {
                    vm.isLoading = false;
                })
                .catch(function () {
                    vm.error = 'Não foi possível obter os dados dos Pokemon.';
                    vm.isLoading = false;
                });
        }

        function updateListPokemon() {
            vm.error = null;
            vm.isLoading = true;
            loadPokemon()
                .then(function () {
                    vm.nextUpdate = moment().add(60, 's');
                    vm.isLoading = false;
                })
                .catch(function () {
                    vm.nextUpdate = moment().add(60, 's');
                    vm.error = 'Não foi possível obter os dados dos Pokemon.';
                    vm.isLoading = false;
                });
        }

        function loadPokemon() {

            return PokemonService.query({
                lastId: lastId
            }).$promise
                .then(function (data) {
                    var newList = [];
                    angular.forEach(data, function (pokemon) {
                        pokemon.iv = calcIVPokemon(pokemon.atk, pokemon.def, pokemon.sta);
                        if (showPokemon(pokemon)) {
                            pokemon.timer = getTimeExpire(pokemon.expires_at);
                            loadAddress(pokemon, true);
                            newList.push(pokemon);
                        }
                    });
                    vm.listPokemon = vm.listPokemon.concat(newList);
                    lastId = data[data.length - 1].id.split('-')[1];
                    createTableParams();
                    return data;
                });
        }

        function getTimeExpire(expires_at) {
            return moment().add(expires_at - new Date().getTime() / 1000, 's');
        }

        function calcIVPokemon(atk, def, sta) {
            if (!atk && !def && !sta) {
                return 0;
            }
            return (atk + def + sta) * 100 / 45;
        }

        function showPokemon(pokemon) {
            var pokemonFilter = angular.fromJson(localStorage.getItem('pokemon-bnu-' + pokemon.pokemon_id));
            if (pokemonFilter) {
                return pokemonFilter.show && (pokemon.iv || 1) >= (pokemonFilter.ivMin || 1) && (pokemon.level || 1) >= (pokemonFilter.lvlMin || 1);
            } else {
                console.log('pokemon.pokemon_id', pokemon.pokemon_id);
                localStorage.setItem('pokemon-bnu-' + pokemon.pokemon_id, angular.toJson({ id: pokemon.pokemon_id, name: pokemon.name, show: true, ivMin: 80, lvlMin: 20 }));
            }
            return false;
        }

        function createTableParams() {
            vm.tableParams = new NgTableParams({ count: 50, sorting: { iv: "desc", name: 'asc' } }, { counts: [], dataset: vm.listPokemon });
        }

        function loadAddress(pokemon, useKey) {
            var messageError = 'Não foi possível obter localização exata. Clique para abrir no google maps.'
            var queryParams = { latlng: pokemon.lat + ',' + pokemon.lon };
            if (useKey) {
                queryParams.key = 'AIzaSyBhArMPqNkrs1kz2k18h5e3rbtGTo9QbsI';
            }

            pokemon.address = 'Carregando localização';
            return GoogleMapsAddressService.get(queryParams)
                .$promise.then(function (addresses) {
                    if (addresses.results[0]) {
                        pokemon.address = addresses.results[0].formatted_address;
                    } else {
                        if (addresses.error_message && useKey) {
                            //retry without key
                            loadAddress(pokemon, false);
                        } else {
                            pokemon.address = messageError;
                        }
                    }
                })
                .catch(function () {
                    pokemon.address = messageError;
                });
        }

        function endTimePokemon(pokemon) {
            vm.listPokemon = vm.listPokemon.filter(function (poke) { return poke.id != pokemon.id });
            createTableParams();
        }

    }
})();