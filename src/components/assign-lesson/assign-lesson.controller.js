(function (angular) {
    'use strict';
    angular
        .module('znk.infra-dashboard.assign-lesson')
        .controller('assignLessonCtrl', function ($scope, locals) {
            $scope.vm = {};
            $scope.vm.cssClass = locals.cssClass;
            $scope.vm.modalTitle = 'Assign Lesson';
            $scope.vm.lessons = [
                {
                    "id":1,
                    "name":"ACT Module 1",
                    "desc":"ACT Module 1 desc",
                    "order":1,
                    "subjectId":0,
                    "assign":true,
                    "results": {
                        "contentAssign":false,
                        "date":1466673537034,
                        "guid":"63d32a42-4d46-4d43-5d8f-60a2d6fac49e",
                        "moduleId":1,
                        "uid":"a04aebb4-50e9-48f8-a8db-4964c4350b84",
                        "tutorId":null
                    }
                },
                {
                    "id":2,
                    "name":"Module 2",
                    "desc":"Desc for module 2",
                    "order":2,
                    "subjectId":2,
                    "assign":false,
                    "results": {
                        "contentAssign":false,
                        "date":1466674319530,
                        "guid":"79db996b-cd75-404b-b913-1f883520fea2",
                        "moduleId":2,
                        "uid":"a04aebb4-50e9-48f8-a8db-4964c4350b84",
                        "tutorId":null
                    }
                }
            ];
        });
})(angular);
