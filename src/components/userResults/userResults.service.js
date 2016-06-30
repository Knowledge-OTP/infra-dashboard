(function (angular) {
    'use strict';

    angular.module('znk.infra-dashboard.userResults').service('UserResultsService', [
        'ENV',
        function (ENV) {
            var userResultsService = {};
            var fbRef = new Firebase(ENV.fbDataEndPoint, ENV.firebaseAppScopeName);
            var self = this;

            function getResultsFromFB(path, uid) {
                return fbRef.child(path).orderByChild('uid').equalTo(uid).once('value').then(function (snapshot) {
                    var arr = [];
                    snapshot.forEach(function(dataItem){
                        var item = dataItem.val();
                        if (item.isComplete) {
                            arr.push(item);
                        }
                    });
                    return arr;
                });
            }

            userResultsService.getExerciseResultsByExerciseType = function (uid, exerciseTypeId) {
                return self.getExerciseResults(uid).then(function (exerciseResults) {
                    var resultsByExerciseType = exerciseResults.filter(function (results) {
                        return results.exerciseTypeId === exerciseTypeId;
                    });

                    return resultsByExerciseType;
                });
            };

            userResultsService.getExerciseResults = function (uid) {
                return getResultsFromFB(ENV.studentAppName + '/exerciseResults', uid);
            };

            userResultsService.getExamResults = function (uid) {
                return getResultsFromFB(ENV.studentAppName + '/examResults', uid);
            };

            return userResultsService;
        }
    ]);
})(angular);
