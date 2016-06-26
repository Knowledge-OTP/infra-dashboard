(function (angular) {
    'use strict';

    angular.module('znk.infra-dashboard.assign-lesson')
        .factory('AssignLessonSrv', function($mdDialog) {
            return {
                openModal: function() {
                    $mdDialog.show({
                        locals: {
                          cssClass: 'assign-lesson-modal'
                        },
                        controller: 'assignLessonCtrl',
                        templateUrl: 'components/assign-lesson/templates/assignLesson.template.html',
                        clickOutsideToClose: true,
                        autoWrap: false
                    });
                }
            };
        });
})(angular);
