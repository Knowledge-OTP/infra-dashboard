(function (angular) {
    'use strict';

    angular.module('demoApp', [
            'znk.infra-dashboard.assign-lesson',
            'pascalprecht.translate',
            'ngMaterial',
            'znk.infra.enum'
        ])
        .controller('demoAppCtrl', function ($scope, AssignLessonSrv) {
            $scope.vm = {};
            $scope.vm.openModal = function() {
                AssignLessonSrv.openModal();
            }
        })
        .config(function ($translateProvider, $translatePartialLoaderProvider) {
            $translatePartialLoaderProvider.addPart('assign-lesson');
            $translateProvider.useLoader('$translatePartialLoader', {
                urlTemplate: '/{part}/locale/{lang}.json'
            });
            $translateProvider.preferredLanguage('en');
        })
        .run(function ($rootScope, $translate) {
            $rootScope.$on('$translatePartialLoaderStructureChanged', function () {
                $translate.refresh();
            });
        });
})(angular);
