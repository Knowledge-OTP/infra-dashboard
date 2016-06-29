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
                        var t0 = performance.now();
                        //
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
                        //
                        var t1 = performance.now();
                        console.log("Call to filterData took " + (t1 - t0) + " milliseconds.");
                    }

                    scope.$watch('dataGetter()', function (data) {
                        rawData = data;
                        filterData();
                    });
                }
            };
        }
    ]);
})(angular);