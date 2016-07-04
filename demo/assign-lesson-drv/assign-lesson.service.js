/* eslint-disable */
(function (angular) {
    'use strict';

    angular.module('demoApp')
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
