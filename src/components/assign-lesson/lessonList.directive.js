(function (angular) {
    'use strict';

    angular.module('znk.infra-dashboard.assign-lesson').directive('lessonList', [
        '$sce',
        function ($sce) {
            return {
                templateUrl: 'components/assign-lesson/templates/lessonList.template.html',
                restrict: 'E',
                scope: {
                    data: '='
                },
                link: function (scope) {
                    scope.columns = [
                        {
                            name: '',
                            cssClassName: 'icon',
                            dataProperty: '',
                            templateFn: iconTemplate
                        },
                        {
                            name: 'Title',
                            cssClassName: 'title',
                            dataProperty: 'name',
                            templateFn: defaultTemplate
                        },
                        {
                            name: 'Subject',
                            cssClassName: 'subject',
                            templateFn: defaultTemplate
                        },
                        {
                            name: 'Description',
                            cssClassName: 'description',
                            dataProperty: 'desc',
                            templateFn: defaultTemplate
                        },
                        {
                            name: 'Select',
                            cssClassName: 'select',
                            dataProperty: 'assign',
                            templateFn: selectTemplate
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
                }
            };
        }
    ]);
})(angular);
