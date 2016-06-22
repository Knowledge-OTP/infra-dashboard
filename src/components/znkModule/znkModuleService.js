'use strict';

(function () {
    angular.module('znk.infra-dashboard.znkModule').factory('ZnkModuleService',[
        'StorageRevSrv',
        function (StorageRevSrv) {
            var znkModuleService = {};

            znkModuleService.getHeaders = function () {
                return StorageRevSrv.getContent({
                    exerciseType: 'moduleheaders'
                });
            };

            znkModuleService.getById = function (moduleId) {
                return StorageRevSrv.getContent({
                    exerciseId: moduleId,
                    exerciseType: 'module'
                });
            };

            return znkModuleService;
        }
    ]);
})();
