(function (angular) {
    'use strict';

    angular.module('znk.infra-dashboard.assign-lesson').directive('lessonList', [
        '$sce', '$timeout', '$q',
        function ($sce, $timeout, $q) {
            return {
                templateUrl: 'components/assign-lesson/templates/lessonList.template.html',
                restrict: 'E',
                scope: {
                    dataGetter: '&data',
                    searchTerm: '=',
                    filtersGetter: '&filters',
                    actions: '=?'
                },
                link: function (scope) {

                    var rawData;

                    if (!angular.isObject(scope.actions)) {
                        scope.actions = {};
                    }

                    scope.d = {};
                    scope.api = {};
                    scope.columns = [
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
                    ];

                    function trustAsHtml(html) {
                        return $sce.trustAsHtml(html);
                    }

                    function iconTemplate(row, col) {
                        return row[col.dataProperty];
                    }

                    function defaultTemplate(row, col) {
                        return row[col.dataProperty];
                    }

                    function selectTemplate(row, col) {
                        scope.isChecked = (row[col.dataProperty]);
                        return '<input id="' + row.id + '" type="checkbox" class="checkbox" ng-checked="isChecked" />' +
                            '<label for="' + row.id + '"></label>';
                    }

                    var getGridApiDefer = $q.defer();
                    scope.actions.refresh = function () {
                        getGridApiDefer.resolve();
                        return getGridApiDefer.promise.then(function () {
                            filterData();
                        });
                    };

                    scope.$watch('dataGetter()', function (data) {
                        console.log('dataGetter() triggered');
                        rawData = data;
                        filterData();
                    });

                    function filterData(){
                        scope.d.processedData = [];
                        if (!rawData || !rawData.length) {
                            return;
                        }
                        rawData.forEach(function (item) {
                            var filters = scope.filtersGetter() || [];
                            for (var i = 0; i < filters.length; i++) {
                                var filter = filters[i];
                                if (!filter(item)) {
                                    return;
                                }
                            }
                            scope.d.processedData.push(item);
                        });
                    }
                }
            };
        }
    ]);
})(angular);
