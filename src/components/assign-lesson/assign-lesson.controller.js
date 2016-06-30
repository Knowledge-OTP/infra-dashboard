/* eslint-disable */
(function (angular) {
    'use strict';
    angular
        .module('znk.infra-dashboard.assign-lesson')
        .controller('assignLessonCtrl', function ($scope, $q, locals, SubjectEnum, $translate, $translatePartialLoader, $log, $http, $timeout, TestScoreCategoryEnum) {
            'ngInject';

            //$translatePartialLoader.addPart('assign-lesson');
            //$translate.refresh();

            $scope.vm = {};
            $scope.vm.cssClass = locals.cssClass;
            $scope.vm.modalTitle = 'Assign Lesson';
            $scope.vm.currentStudent = 'Brandon Butler'; // TODO: mock
            $scope.vm.currentSubject = '';
            $scope.vm.currentStatus = '';
            $scope.vm.searchTerm = '';
            $scope.selectedLessons = [];

            $http({
                method: 'GET',
                //url: 'http://localhost:9002/assign-lesson/MOCK_DATA_500.json'
                url: 'http://localhost:9002/assign-lesson/MOCK_DATA_20.json'
            }).then(function successCallback(response) {
                $scope.vm.lessons = response.data;
            }, function errorCallback(response) {

            });

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
                        dataProperty: '',
                        // colTemplateFn: selectTemplate,
                        callbackFn: onLessonSelect,
                        compile: true
                    }
                ],
                subjectMapping: [
                    {
                        id: SubjectEnum.ENGLISH.enum,
                        iconName: 'english-icon'
                    },
                    {
                        id: SubjectEnum.MATH.enum,
                        iconName: 'math-icon'
                    },
                    {
                        id: SubjectEnum.READING.enum,
                        iconName: 'reading-icon'
                    },
                    {
                        id: SubjectEnum.SCIENCE.enum,
                        iconName: 'science-icon'
                    },
                    {
                        id: SubjectEnum.WRITING.enum,
                        iconName: 'writing-icon'
                    }
                ]
            };

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
            //            colTemplateFn: selectTemplate
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

            //self.statusSelectedHandler = function (selectedStatusId) {
            //    //filtersValues.exercise = selectedStatusId;
            //    //_refreshGrid();
            //    if (selectedStatusId === null) {
            //        self.currentSelectedStatus = '';
            //    } else {
            //        self.exerciseTypesForFilter.filter(function (obj) {
            //            if (obj.id === selectedStatusId) {
            //                self.currentSelectedStatus = obj.name;
            //            }
            //        });
            //    }
            //};


            /**
             * Template Functions
             */

            function iconTemplate(row, col) {
                //var html;
                //var iconObj = $scope.vm.gridOptions.subjectMapping.filter(function (subject) {
                //    return subject.id === row[col.dataProperty];
                //});
                //if (iconObj.length !== 0) {
                //    var iconName = iconObj[0].iconName;
                //    html = '<svg-icon name=' + iconName + '></svg-icon>';
                //} else {
                //    html = '';
                //}
                //return html;
            }

            function defaultTemplate(row, col) {
                return row[col.dataProperty];
            }

            //function selectTemplate(row, col) {
            //    //debugger;
            //    //return '<input id="lesson-item-'+row.id+'" type="checkbox" class="checkbox" ng-click="'+onLessonSelect(row.id)+'"/>' +
            //    //    '<label for="lesson-item-'+row.id+'"></label>';
            //    //return '<input id="lesson-item-'+row.id+'" ' +
            //    //    '         type="checkbox" ' +
            //    //    '         class="checkbox" ' +
            //    //    '         ng-click="' + col.callbackFn(row, col) + '" /> ' +
            //    //    '    <label for="lesson-item-'+row.id+'"></label>';
            //}

            function onLessonSelect(row) {
                $scope.selectedLessons[row.id] = !$scope.selectedLessons[row.id];
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
                console.log($scope.selectedLessons);
                //return $scope.vm.gridActions.submit();
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
