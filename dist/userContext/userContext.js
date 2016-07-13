(function (angular) {
    'use strict';

    angular.module('znk.infra-dashboard.userContext', []);
})(angular);

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

angular.module('znk.infra-dashboard.userContext').run(['$templateCache', function($templateCache) {

}]);
