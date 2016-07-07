(function (angular) {
    'use strict';

    angular.module('znk.infra-dashboard.assign-lesson-drv', []);
})(angular);

(function (angular) {
    'use strict';

    var module = angular.module('znk.infra-dashboard.assign-lesson-drv');

    module.directive('compileHtml', ['$compile', function ($compile) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                scope.$watch(function () {
                    return scope.$eval(attrs.compileHtml);
                }, function (value) {
                    // In case value is a TrustedValueHolderType, sometimes it
                    // needs to be explicitly called into a string in order to
                    // get the HTML string.
                    element.html(value && value.toString());
                    // If scope is provided use it, otherwise use parent scope
                    var compileScope = scope;
                    if (attrs.bindHtmlScope) {
                        compileScope = scope.$eval(attrs.bindHtmlScope);
                    }
                    $compile(element.contents())(compileScope);
                });
            }
        };
    }]);
}(window.angular));

/* eslint-disable */
(function (angular) {
    'use strict';

    angular.module('znk.infra-dashboard.assign-lesson-drv').directive('lessonList', [
        '$timeout', '$q', '$log',
        function ($timeout, $q, $log) {
            return {
                templateUrl: 'components/assign-lesson-drv/templates/lessonList.template.html',
                restrict: 'E',
                scope: {
                    options: '=',
                    dataGetter: '&data',
                    searchTerm: '=',
                    filtersGetter: '&filters',
                    actions: '='
                },
                link: function (scope) {
                    var rawData;

                    if (!angular.isObject(scope.actions)) {
                        scope.actions = {};
                    }

                    if (!angular.isObject(scope.options) || angular.isUndefined(scope.options)) {
                        $log.error('No options passed to grid');
                        return;
                    }

                    scope.d = {};
                    scope.api = {};

                    var getGridApiDefer = $q.defer();
                    scope.actions.refresh = function () {
                        getGridApiDefer.resolve();
                        return getGridApiDefer.promise.then(function () {
                            filterData();
                        });
                    };

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

                    scope.$watch('dataGetter()', function (data) {
                        if (angular.isUndefined(data) || !angular.isArray(data)) {
                            return;
                        }
                        rawData = data;
                        filterData();
                    });
                }
            };
        }
    ]);
})(angular);

angular.module('znk.infra-dashboard.assign-lesson-drv').run(['$templateCache', function($templateCache) {
  $templateCache.put("components/assign-lesson-drv/templates/lessonList.template.html",
    "<div class=\"lesson-list\">\n" +
    "    <header class=\"list-header row-header flex-container\">\n" +
    "        <div ng-repeat=\"column in options.columns\"\n" +
    "             ng-class=\"::column.cssClassName\"\n" +
    "             class=\"flex-item\">\n" +
    "            {{column.name}}\n" +
    "        </div>\n" +
    "    </header>\n" +
    "    <div class=\"no-rows-for-filter\" ng-if=\"d.processedData.length === 0\">\n" +
    "        {{options.translatedStrings.NO_LESSONS_FOR_FILTER}}\n" +
    "    </div>\n" +
    "    <div class=\"rows-wrapper znk-scrollbar\" ng-if=\"d.processedData.length\">\n" +
    "        <div ng-repeat=\"row in d.processedData as results track by row.id\"\n" +
    "             class=\"lesson-item flex-container\">\n" +
    "            <div ng-repeat=\"column in options.columns\"\n" +
    "                 ng-class=\"::column.cssClassName\"\n" +
    "                 class=\"col flex-item\">\n" +
    "                <div ng-switch=\"column.compile\" class=\"col-inner\">\n" +
    "                    <div ng-switch-when=\"true\" compile-html=\"column.colTemplateFn(row, column)\"></div>\n" +
    "                    <div ng-switch-default>{{column.colTemplateFn(row, column)}}</div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);
