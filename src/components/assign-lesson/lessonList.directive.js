(function (angular) {
    'use strict';

    angular.module('znk.infra-dashboard.assign-lesson').directive('lessonList', [
        '$sce',
        function ($sce) {
            return {
                templateUrl: 'components/assign-lesson/templates/lessonList.template.html',
                restrict: 'E',
                scope: {
                    dataGetter: '&data',
                    searchTerm: '=',
                    filtersGetter: '&filters'
                },
                link: function (scope, element, attrs) {

                    //var getGridApiDefer = $q.defer();
                    //scope.actions.refresh = function () {
                    //    return getGridApiDefer.promise.then(function (gridApi) {
                    //        gridApi.core.refreshRows();
                    //        return gridApi.grid.refresh();
                    //    });
                    //};

                    scope.d = {};

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

                    // listen to changes in the search term and update the grid
                    scope.$watch('searchTerm', function (newVal) {
                        if (angular.isUndefined(newVal)) {
                            return;
                        }
                        attrs.searchTerm = newVal;
                    });

                    scope.$watch('dataGetter()', function (data) {
                        scope.d.processedData = [];

                        if (!data || !data.length) {
                            return;
                        }

                        data.forEach(function (item) {
                            var filters = scope.filtersGetter() || [];
                            for (var i = 0; i < filters.length; i++) {
                                var filter = filters[i];
                                if (!filter(item)) {
                                    return;
                                }
                            }
                            scope.d.processedData.push(item);
                        });
                    });
                }
            };
        }
    ]);
})(angular);
