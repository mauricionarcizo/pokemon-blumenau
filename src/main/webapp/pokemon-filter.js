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
                    vm.listPokemon = data.pokemon;
                });
        }
    }
})();