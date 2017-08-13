(function () {
    'use strict';

    angular
        .module('TimerCountdown', [])
        .component('timerCountdown', {
            template: '<div style="display:inline;">{{$ctrl.countDownTime}}</div>',
            controller: TimerCountdownController,
            controllerAs: '$ctrl',
            bindings: {
                endTime: '<',
                onFinish: '&'
            },
        });

    function TimerCountdownController($injector, $scope) {
        var $ctrl = this;
        var $interval = $injector.get('$interval');
        $ctrl.countDownTime = '00:00';
        var interval = $interval(countDown, 1000);

        function countDown() {
            var now = moment();
            var secondsDiff = $ctrl.endTime.diff(now, 's');
            var minutes = moment.duration(secondsDiff, 's').minutes();
            var seconds = moment.duration(secondsDiff, 's').seconds();
            if (minutes < 10) {
                $ctrl.countDownTime = '0' + (minutes < 0 ? 0 : minutes);
            } else {
                $ctrl.countDownTime = minutes;
            }
            $ctrl.countDownTime += ':';
            if (seconds < 10) {
                $ctrl.countDownTime += '0' + (seconds < 0 ? 0 : seconds);
            } else {
                $ctrl.countDownTime += seconds;
            }

            if (secondsDiff <= 0) {
                $interval.cancel(interval);
                if ($ctrl.onFinish) {
                    $scope.$eval($ctrl.onFinish);
                }
                return;
            }
        }

        $ctrl.$onInit = function () {
            countDown();
        }

        $ctrl.$onDestroy = function () {
            $interval.cancel(interval);
        };
    }
})();