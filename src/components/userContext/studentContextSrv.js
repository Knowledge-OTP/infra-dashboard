(function (angular) {
    'use strict';

    angular.module('znk.infra-dashboard.userContext').service('StudentContextSrv', [
        function () {
            var StudentContextSrv = {};

            var _currentStudentUid = '';

            StudentContextSrv.getCurrUid = function () {
                return _currentStudentUid;
            };

            StudentContextSrv.setCurrentUid = function (uid) {
                _currentStudentUid = uid;
            };

            return StudentContextSrv;
        }
    ]);
})(angular);