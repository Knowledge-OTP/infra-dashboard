(function (angular) {
    'use strict';

    angular.module('znk.infra-dashboard.utils', []);
})(angular);

(function (angular) {
    'use strict';

    angular.module('znk.infra-dashboard.utils').filter('cutString', [function () {

        return function (str, length) {

            if (!str) {
                return '';
            }
            if (str.length < length) {
                return str;
            }

            var words = str.split(' ');
            var newStr = '';

            for (var i = 0; i < words.length; i++) {
                if (newStr.length + words[i].length <= length) {
                    newStr = newStr + words[i] + ' ';
                } else {
                    break;
                }
            }

            return newStr + '...';
        };
    }]);
})(angular);

angular.module('znk.infra-dashboard.utils').run(['$templateCache', function($templateCache) {

}]);
