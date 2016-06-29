(function (angular) {
    'use strict';
    angular
        .module('znk.infra-dashboard.assign-lesson')
        .controller('assignLessonCtrl', function ($scope, $q, locals, SubjectEnum, $translate, $translatePartialLoader, $log, $http) {
            'ngInject';

            //$translatePartialLoader.addPart('assign-lesson');
            //$translate.refresh();

            $scope.vm = {};
            $scope.vm.cssClass = locals.cssClass;
            $scope.vm.modalTitle = 'Assign Lesson';
            $scope.vm.currentStudent = 'Brandon Butler'; // TODO: mock

            //$scope.vm.lessons = [
            //    {
            //        "id":1,
            //        "name":"ACT Module 1",
            //        "desc":"ACT Module 1 desc",
            //        "order":1,
            //        "subjectId":0,
            //        "assign":true,
            //        "results": {
            //            "contentAssign":false,
            //            "date":1466673537034,
            //            "guid":"63d32a42-4d46-4d43-5d8f-60a2d6fac49e",
            //            "moduleId":1,
            //            "uid":"a04aebb4-50e9-48f8-a8db-4964c4350b84",
            //            "tutorId":null
            //        }
            //    },
            //    {
            //        "id":2,
            //        "name":"Module 2",
            //        "desc":"Desc for module 2",
            //        "order":2,
            //        "subjectId":2,
            //        "assign":false,
            //        "results": {
            //            "contentAssign":false,
            //            "date":1466674319530,
            //            "guid":"79db996b-cd75-404b-b913-1f883520fea2",
            //            "moduleId":2,
            //            "uid":"a04aebb4-50e9-48f8-a8db-4964c4350b84",
            //            "tutorId":null
            //        }
            //    }
            //];

            $http({
                method: 'GET',
                url: 'http://localhost:9002/assign-lesson/MOCK_DATA_500.json'
            }).then(function successCallback(response) {
                $scope.vm.lessons = response.data;
            }, function errorCallback(response) {

            });

            $scope.vm.gridOptions = {
                columns: [
                    {
                        name: '',
                        cssClassName: 'icon',
                        dataProperty: '',
                        colTemplateFn: iconTemplate
                    },
                    {
                        name: 'Title',
                        cssClassName: 'title',
                        dataProperty: 'name',
                        colTemplateFn: defaultTemplate
                    },
                    {
                        name: 'Subject',
                        cssClassName: 'subject',
                        colTemplateFn: defaultTemplate
                    },
                    {
                        name: 'Description',
                        cssClassName: 'description',
                        dataProperty: 'desc',
                        colTemplateFn: defaultTemplate
                    },
                    {
                        name: 'Select',
                        cssClassName: 'select',
                        dataProperty: 'assign',
                        colTemplateFn: selectTemplate
                    }
                ]
            };
            $scope.vm.currentSubject = '';
            $scope.vm.currentStatus = '';


            /**
             * Filters
             */

            $scope.vm.subjects = [
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

            $scope.vm.statuses = [
                {
                    id: 1,
                    name: 'Assigned',
                    val: true
                },
                {
                    id: 2,
                    name: 'Not Assigned',
                    val: false
                }
            ];

            //$translate([
            //    translateNamespace + '.' + 'EXERCISE_TYPES.EXERCISES',
            //    translateNamespace + '.' + 'EXERCISE_TYPES.SECTIONS'
            //]).then(function (translation) {
            //    self.exerciseTypesForFilter = [
            //        {
            //            id: 1,
            //            name: translation['DASHBOARD_REVIEW.EXERCISE_TYPES.EXERCISES']
            //        },
            //        {
            //            id: 2,
            //            name: translation['DASHBOARD_REVIEW.EXERCISE_TYPES.SECTIONS']
            //        }
            //    ];
            //}).catch(function (err) {
            //    $log.debug('Could not fetch translation', err);
            //});

            var translateNamespace = 'ASSIGN_LESSON';
            var translatedStrings = [
                translateNamespace + '.SUBJECT_LABEL',
                translateNamespace + '.STATUS_LABEL'
            ];

            $translate(translatedStrings).then(function(translation){
                $scope.vm.subjectLabel = translation[translateNamespace + '.SUBJECT_LABEL'];
                $scope.vm.statusLabel = translation[translateNamespace + '.STATUS_LABEL'];
            }).catch(function(err){
                $log.debug(err);
            });

            var filtersValues = {};
            $scope.vm.subjectSelectedHandler = function (selectedSubjectId) {
                filtersValues.subject = selectedSubjectId;
                _refreshGrid();
                $scope.vm.currentSelectedSubject = (SubjectEnum.getEnumMap()[selectedSubjectId]) ? SubjectEnum.getEnumMap()[selectedSubjectId] : '';
            };

            self.statusSelectedHandler = function (selectedStatusId) {
                filtersValues.exercise = selectedStatusId;
                _refreshGrid();
                if (selectedStatusId === null) {
                    self.currentSelectedStatus = '';
                } else {
                    self.exerciseTypesForFilter.filter(function (obj) {
                        if (obj.id === selectedStatusId) {
                            self.currentSelectedStatus = obj.name;
                        }
                    });
                }
            };


            $scope.vm.submitAssigned = function() {
              console.log('assigned button clicked');
            };

            /**
             * Template Functions
             */

            function iconTemplate(row, col) {
                return row[col.dataProperty];
            }

            function defaultTemplate(row, col) {
                return row[col.dataProperty];
            }

            function selectTemplate(row, col) {
                //var isChecked = (row[col.dataProperty]);
                //return '<input id="' + row.id + '" type="checkbox" class="checkbox" ng-checked="'+isChecked+'" />' +
                //    '<label for="' + row.id + '"></label>';
                return '<input id="' + row.id + '"' +
                    '          type="checkbox"' +
                    '          class="checkbox" />' +
                    '<label for="' + row.id + '"></label>';
            }

            /**
             *  Filter Functions
             */

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

            var watchFilters = [
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

            $scope.$watchGroup(watchFilters, function(newValues) {
                if (!newValues) {
                    return;
                }
                _refreshGrid();
            });
        });
})(angular);
