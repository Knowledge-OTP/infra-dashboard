(function (angular) {
    'use strict';

    angular.module('demoApp', ['ngMaterial', 'znk.infra-dashboard.assign-lesson'])
        .controller('demoAppCtrl', function ($scope, AssignLessonSrv) {
            $scope.vm = {};
            $scope.vm.openModal = function() {
                AssignLessonSrv.openModal();
            }
        });
})(angular);
