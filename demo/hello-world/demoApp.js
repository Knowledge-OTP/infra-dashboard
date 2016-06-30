(function (angular) {
    'use strict';

    angular.module('demoApp', [])
        .config([function() {
        }])
        .service('demoSrv', function() {
            this.sayHello = function () {
                return 'Hello, World!';
            }
        })
        .controller('demoCtrl', function ($scope, demoSrv) {
            $scope.hello = demoSrv.sayHello();
        });
})(angular);
