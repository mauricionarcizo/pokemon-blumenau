(function () {
    'use strict';

    angular
        .module('PokemonBlumenauApp')
        .component('pokemonFilter', {
            templateUrl: './pokemon-filter.html',
            controller: PokemonFilterController,
            controllerAs: 'vm'
        });

    function PokemonFilterController($injector) {
        var vm = this;
        var PokemonListService = $injector.get('PokemonListService');
        var $q = $injector.get('$q');

        vm.configPokemonChange = configPokemonChange;
        vm.showAllPokemon = showAllPokemon;
        vm.setIvMinAllPokemon = setIvMinAllPokemon;

        init();

        function init() {
            vm.isLoading = true;
            $q.when(loadListPokemon())
                .finally(function () {
                    vm.isLoading = false;
                });
        }

        function loadListPokemon() {
            return PokemonListService.get({}).$promise
                .then(function (data) {
                    vm.listPokemon = [];
                    angular.forEach(data.pokemon, function (pokemon) {
                        var pokemonSaved = localStorage.getItem('pokemon-' + pokemon.id);
                        if (pokemonSaved) {
                            pokemon = Object.assign(pokemon, angular.fromJson(pokemonSaved));
                        }
                        vm.listPokemon.push(pokemon);
                    });
                });
        }

        function configPokemonChange(pokemon) {
            localStorage.setItem('pokemon-' + pokemon.id, angular.toJson(pokemon));
        }

        function showAllPokemon(check) {
            angular.forEach(vm.listPokemon, function (pokemon) {
                pokemon.show = check;
                configPokemonChange(pokemon);
            });
        }

        function setIvMinAllPokemon(ivMin){
            angular.forEach(vm.listPokemon, function (pokemon) {
                pokemon.ivMin = ivMin;
                configPokemonChange(pokemon);
            });
        }
    }
})();