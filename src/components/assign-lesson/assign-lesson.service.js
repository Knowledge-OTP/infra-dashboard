(function (angular) {
    'use strict';

    angular.module('znk.infra-dashboard.assign-lesson')
        .factory('AssignLessonSrv', function($mdDialog) {
            return {
                openModal: function() {
                    $mdDialog.show({
                        controller: 'assignLessonCtrl',
                        templateUrl: 'components/assign-lesson/assign-lesson.template.html',
                        clickOutsideToClose: true
                    })
                }
            };
        });
})(angular);

