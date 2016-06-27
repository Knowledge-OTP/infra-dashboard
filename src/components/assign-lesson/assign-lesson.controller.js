(function (angular) {
    'use strict';
    angular
        .module('znk.infra-dashboard.assign-lesson')
        .controller('assignLessonCtrl', function ($scope, $q, locals) {
            'ngInject';

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
            $scope.vm.currentSubject = '';
            $scope.vm.currentStatus = '';



            /**
             * Filters
             */

            self.subjects = [
                {
                    id: SubjectEnum.ENGLISH.enum,
                    name: 'English'
                },
                {
                    id: SubjectEnum.MATH.enum,
                    name: 'Math'
                },
                {
                    id: SubjectEnum.READING.enum,
                    name: 'Reading'
                },
                {
                    id: SubjectEnum.SCIENCE.enum,
                    name: 'Science'
                },
                {
                    id: SubjectEnum.WRITING.enum,
                    name: 'Writing'
                }
            ];

            $translate([
                translateNamespace + '.' + 'EXERCISE_TYPES.EXERCISES',
                translateNamespace + '.' + 'EXERCISE_TYPES.SECTIONS'
            ]).then(function (translation) {
                self.exerciseTypesForFilter = [
                    {
                        id: 1,
                        name: translation['DASHBOARD_REVIEW.EXERCISE_TYPES.EXERCISES']
                    },
                    {
                        id: 2,
                        name: translation['DASHBOARD_REVIEW.EXERCISE_TYPES.SECTIONS']
                    }
                ];
            }).catch(function (err) {
                $log.debug('Could not fetch translation', err);
            });

            self.exercisesLabel = translateFilter('DASHBOARD_REVIEW.EXERCISES_FILTER_LABEL');

            self.subjectLabel = translateFilter('DASHBOARD_REVIEW.SUBJECT_FILTER_LABEL');

            var filtersValues = {};
            self.subjectSelectedHandler = function (selectedSubjectId) {
                filtersValues.subject = selectedSubjectId;
                _refreshGrid();
                self.currentSelectedSubject = (SubjectEnum.getEnumMap()[selectedSubjectId]) ? SubjectEnum.getEnumMap()[selectedSubjectId] : '';
            };

            self.exerciseSelectedHandler = function (selectedExerciseId) {
                filtersValues.exercise = selectedExerciseId;
                _refreshGrid();
                if (selectedExerciseId === null) {
                    self.currentSelectedExercise = '';
                } else {
                    self.exerciseTypesForFilter.filter(function (obj) {
                        if (obj.id === selectedExerciseId) {
                            self.currentSelectedExercise = obj.name;
                        }
                    });
                }
            };


            function subjectFilter(gridItem) {
                var value = $scope.vm.currentSubject;
                return value ? gridItem.subjectId === value : true;
            }

            function statusFilter(gridItem) {
                var value = $scope.vm.currentStatus;
                return value ? gridItem.assign === value : true;
            }

            function searchFilter(gridItem) {
                var value = ($scope.vm.searchTerm) ? $scope.vm.searchTerm.toLowerCase() : '';
                return value ? (gridItem.name.toLowerCase().indexOf(value) > -1 || gridItem.desc.toLowerCase().indexOf(value) > -1) : true; // what if data member s undefined?
            }

            $scope.vm.gridFilters = [
                subjectFilter,
                statusFilter,
                searchFilter
            ];

            var filtersValues = [
                'vm.currentSubject',
                'vm.currentStatus',
                'vm.searchTerm'
            ];

            function _refreshGrid() {
                if ($scope.vm.gridActions && $scope.vm.gridActions.refresh) {
                    return $scope.vm.gridActions.refresh();
                }
                return $q.reject('refresh grid function not set yet');
            }

            $scope.$watchGroup(filtersValues, function(newValues) {
                if (!newValues) {
                    return;
                }
                _refreshGrid();
            });
        });
})(angular);
