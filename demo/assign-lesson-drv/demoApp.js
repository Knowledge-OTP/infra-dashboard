(function (angular) {
    'use strict';

    angular.module('demoApp', [
            'znk.infra-dashboard.assign-lesson-drv',
            'pascalprecht.translate',
            'ngMaterial',
            'znk.infra.enum',
            'znk.infra.svgIcon'
            // 'TestScoreCategoryEnum.module',
        ])
        //.controller('demoAppCtrl', function ($scope, AssignLessonSrv) {
        .controller('demoAppCtrl', function ($scope, $mdDialog) {
            $scope.vm = {};
            $scope.vm.openModal = function() {
                //AssignLessonSrv.openModal();
                $mdDialog.show({
                    locals: {
                        cssClass: 'assign-lesson-modal'
                    },
                    controller: 'assignLessonModalCtrl',
                    templateUrl: 'templates/assignLesson.template.html',
                    clickOutsideToClose: true,
                    autoWrap: false
                });
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
