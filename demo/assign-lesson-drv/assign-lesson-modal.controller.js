/* eslint-disable */
(function (angular) {
    'use strict';
    angular
        .module('demoApp')
        .controller('assignLessonModalCtrl', function ($scope, $q, locals, $translate, $translatePartialLoader, $log, $http, $timeout/*, SubjectEnum, TestScoreCategoryEnum*/) {
            'ngInject';

            $scope.vm = {};
            $scope.vm.gridActions = {};
            $scope.vm.cssClass = locals.cssClass;
            $scope.vm.modalTitle = 'Assign Lesson';
            $scope.vm.currentStudent = 'Brandon Butler';
            $scope.vm.currentSubject = '';
            $scope.vm.currentStatus = '';
            $scope.vm.searchTerm = '';
            $scope.vm.selectedLessons = [];

            var translateNamespace = 'ASSIGN_LESSON';
            var translatedStrings = [
                translateNamespace + '.SUBJECT_LABEL',
                translateNamespace + '.STATUS_LABEL',
                translateNamespace + '.ASSIGNED',
                translateNamespace + '.CLEAR_FILTER',
                translateNamespace + '.NO_LESSONS_FOR_FILTER'
            ];

            $translate(translatedStrings).then(function(translation){
                $scope.vm.subjectLabel = translation[translateNamespace + '.SUBJECT_LABEL'];
                $scope.vm.statusLabel = translation[translateNamespace + '.STATUS_LABEL'];
                $scope.vm.assignedText = translation[translateNamespace + '.ASSIGNED'];
                $scope.vm.clearFilter = translation[translateNamespace + '.CLEAR_FILTER'];
                $scope.vm.noLessonsForFilter = translation[translateNamespace + '.NO_LESSONS_FOR_FILTER'];


                $scope.vm.gridData = [];
                $timeout(function(){
                    $scope.vm.gridData = [
                        {"id":1,"name":"Writing Module D (Grammar)","desc":"Perez","order":1,"subjectId":8,"categoryId":12,"assign":true},
                        {"id":2,"name":"Reading Module A (Broad Comprehension)","desc":"Cox","order":2,"subjectId":8,"categoryId":9,"assign":false},
                        {"id":3,"name":"Reading Module B (Rhetoric)","desc":"Jordan","order":3,"subjectId":6,"categoryId":11,"assign":true},
                        {"id":4,"name":"Reading Module C (Fine Points)","desc":"Sanders","order":4,"subjectId":7,"categoryId":12,"assign":false},
                        {"id":5,"name":"Eugene","desc":"Hughes","order":5,"subjectId":3,"categoryId":12,"assign":false},
                        {"id":6,"name":"Frances","desc":"Bell","order":6,"subjectId":6,"categoryId":10,"assign":false},
                        {"id":7,"name":"Chris","desc":"Barnes","order":7,"subjectId":7,"categoryId":11,"assign":true},
                        {"id":8,"name":"Helen","desc":"George","order":8,"subjectId":7,"categoryId":10,"assign":false},
                        {"id":9,"name":"Teresa","desc":"Cox","order":9,"subjectId":4,"categoryId":10,"assign":true},
                        {"id":10,"name":"Robin","desc":"Stewart","order":10,"subjectId":2,"categoryId":9,"assign":true}
                    ];
                }, 1500);

                //$http({
                //    method: 'GET',
                //    url: 'http://localhost:9002/MOCK_DATA_100.json'
                //}).then(function successCallback(response) {
                //    $scope.vm.lessons = response.data;
                //}, function errorCallback(response) {
                //    $log.error(response);
                //});

                $scope.ACT_Options = {
                    columns: [
                        {
                            name: '',
                            cssClassName: 'icon',
                            dataProperty: 'subjectId',
                            colTemplateFn: iconTemplate,
                            compile: true
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
                            colTemplateFn: function(row) {
                                var subjectObj = $scope.vm.gridOptions.subjectMapping.filter(function (subject) {
                                    return subject.id === row.subjectId;
                                });
                                return (subjectObj.length !== 0) ? subjectObj[0].name : '';
                            }
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
                            dataProperty: '',
                            colTemplateFn: selectTemplate,
                            onLessonSelect: onLessonSelect,
                            compile: true
                        }
                    ],
                    translatedStrings: {
                        'NO_LESSONS_FOR_FILTER' : $scope.vm.noLessonsForFilter
                    },
                    subjectMapping: [
                        {
                            //id: SubjectEnum.ENGLISH.enum,
                            id: 5,
                            //name: SubjectEnum.ENGLISH.val,
                            name: 'english',
                            iconName: 'english-icon'
                        },
                        {
                            //id: SubjectEnum.MATH.enum,
                            id: 0,
                            //name: SubjectEnum.MATH.val,
                            name: 'math',
                            iconName: 'math-icon'
                        },
                        {
                            //id: SubjectEnum.READING.enum,
                            id: 1,
                            //name: SubjectEnum.READING.val,
                            name: 'reading',
                            iconName: 'reading-icon'
                        },
                        {
                            //id: SubjectEnum.SCIENCE.enum,
                            id: 6,
                            //name: SubjectEnum.SCIENCE.val,
                            name: 'science',
                            iconName: 'science-icon'
                        },
                        {
                            //id: SubjectEnum.WRITING.enum,
                            id: 2,
                            //name: SubjectEnum.WRITING.val,
                            name: 'writing',
                            iconName: 'writing-icon'
                        }
                    ]
                };

                //     MATH: 0,
                //     READING: 1,
                //     WRITING: 2,
                //     LISTENING: 3,
                //     SPEAKING: 4,
                //     ENGLISH: 5,
                //     SCIENCE: 6,
                //     VERBAL: 7,
                //     ESSAY: 8

                //$scope.SAT_Options = {
                //    columns: [
                //        {
                //            name: '',
                //            cssClassName: 'icon',
                //            dataProperty: 'categoryId',
                //            colTemplateFn: iconTemplate
                //        },
                //        {
                //            name: 'Title',
                //            cssClassName: 'title',
                //            dataProperty: 'name',
                //            colTemplateFn: defaultTemplate
                //        },
                //        {
                //            name: 'Subject',
                //            cssClassName: 'subject',
                //            colTemplateFn: defaultTemplate
                //        },
                //        {
                //            name: 'Description',
                //            cssClassName: 'description',
                //            dataProperty: 'desc',
                //            colTemplateFn: defaultTemplate
                //        },
                //        {
                //            name: 'Select',
                //            cssClassName: 'select',
                //            dataProperty: 'assign',
                //            //colTemplateFn: selectTemplate
                //        }
                //    ],
                //    subjectMapping: [
                //        {
                //            id: TestScoreCategoryEnum.MATH.enum,
                //            iconName: 'math-icon'
                //        },
                //        {
                //            id: TestScoreCategoryEnum.READING.enum,
                //            iconName: 'reading-icon'
                //        },
                //        {
                //            id: TestScoreCategoryEnum.WRITING.enum,
                //            iconName: 'writing-icon'
                //        },
                //        {
                //            id: TestScoreCategoryEnum.ESSAY.enum,
                //            iconName: 'essay-icon'
                //        }
                //    ]
                //};

                $scope.vm.gridOptions = $scope.ACT_Options;

            }).catch(function(err){
                $log.debug(err);
            });


            /**
             * Filters
             */

            $scope.vm.ACT_Subjects = [
                {
                    //id: SubjectEnum.ENGLISH.enum,
                    id: 5,
                    name: 'English'
                },
                {
                    //id: SubjectEnum.MATH.enum,
                    id: 0,
                    name: 'Math'
                },
                {
                    //id: SubjectEnum.READING.enum,
                    id: 1,
                    name: 'Reading'
                },
                {
                    //id: SubjectEnum.SCIENCE.enum,
                    id: 6,
                    name: 'Science'
                },
                {
                    //id: SubjectEnum.WRITING.enum,
                    id: 2,
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


            /**
             * Template Functions
             */

            function iconTemplate(row, col) {
                var html;
                var iconObj = $scope.vm.gridOptions.subjectMapping.filter(function (subject) {
                    return subject.id === row[col.dataProperty];
                });
                if (iconObj.length !== 0) {
                    var iconName = iconObj[0].iconName;
                    html = '<svg-icon name=' + iconName + '></svg-icon>';
                } else {
                    html = '';
                }
                return html;
                return '';
            }

            function defaultTemplate(row, col) {
                return row[col.dataProperty];
            }

            function selectTemplate(row) {
                var html;
                if (row.assign) {
                    html = '<div class="assigned">' + $scope.vm.assignedText + '</div>';
                } else {
                    html = '<div class="select-wrap">' +
                        '<input id="lesson-item-'+row.id+'" ' +
                        '         type="checkbox" ' +
                        '         class="checkbox" ' +
                        '         ng-click="column.onLessonSelect(row)" /> ' +
                        '<label for="lesson-item-'+row.id+'"></label>' +
                        '</div>';
                }
                return html;
            }

            function onLessonSelect (row) {
                $scope.vm.selectedLessons[row.id] = !$scope.vm.selectedLessons[row.id];
                // $log.debug('row ' + row.id + ' is checked');
            }


            /**
             *  Filter Functions
             */

            function subjectFilter(gridItem) {
                var value = $scope.vm.currentSubject;
                return angular.isNumber(value) ? gridItem.subjectId === value : true;
            }

            function statusFilter(gridItem) {
                var value = $scope.vm.currentStatus;
                return (value === "") ? true : gridItem.assign === value;
            }

            function searchFilter(gridItem) {
                var value = ($scope.vm.searchTerm) ? $scope.vm.searchTerm.toLowerCase() : '';
                return value ? (gridItem.name.toLowerCase().indexOf(value) > -1 || gridItem.desc.toLowerCase().indexOf(value) > -1) : true; // what if data member s undefined?
            }


            /**
             * Custom Filtering functions can be passed to this array
             * Function must return true / false
             * @arg gridItem
             */
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

            $scope.vm.submitAssigned = function() {
                console.log($scope.vm.selectedLessons);
            };

            $scope.$watchGroup(watchFilters, function(newValues, oldValues) {
                if (angular.equals(newValues, oldValues)) {
                    return;
                }
                $timeout(function(){
                    _refreshGrid();
                }, 300);
            });
        });
})(angular);
