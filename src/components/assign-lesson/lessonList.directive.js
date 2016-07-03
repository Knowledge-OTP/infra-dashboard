/* eslint-disable */
(function (angular) {
    'use strict';

    angular.module('znk.infra-dashboard.assign-lesson').directive('lessonList', [
        '$timeout', '$q', '$log',
        function ($timeout, $q, $log) {
            return {
                templateUrl: 'components/assign-lesson/templates/lessonList.template.html',
                restrict: 'E',
                scope: {
                    options: '=',
                    dataGetter: '&data',
                    searchTerm: '=',
                    filtersGetter: '&filters',
                    actions: '='
                },
                link: function (scope) {
                    console.log('Directive: ', scope);
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

                    //scope.actions.onLessonSelect = function (row) {
                    //    debugger;
                    //};

                    //scope.actions.submit = function () {
                    //    //if (!scope.d.processedData || scope.d.processedData.length === 0) {
                    //    //    return;
                    //    //}
                    //    //angular.forEach(scope.d.processedData, function(value, key){
                    //    //    debugger;
                    //    //});
                    //};

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
                        console.log('dataGetter() triggered');
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
