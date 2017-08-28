(function (angular) {
    'use strict';

    angular.module('znk.infra-dashboard.userResults').service('UserResultsService', [
        'ENV', '$window',
        function (ENV, $window) {
            var userResultsService = {};
            var fbRef = initializeFireBase().database().ref();
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

            userResultsService.getExamResults = function (uid) {
                return getResultsFromFB(ENV.studentAppName + '/examResults', uid);
            };

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

            function initializeFireBase() {
                var dbName = ENV.firebaseAppScopeName;
                var config = {
                    apiKey: ENV.firebase_apiKey,
                    authDomain: ENV.fbGlobalEndPoint,
                    databaseURL: ENV.fbDataEndPoint,
                    projectId: ENV.firebase_projectId,
                    storageBucket: ENV.firebase_projectId + '.appspot.com',
                    messagingSenderId: ENV.firebase_messagingSenderId
                };

                var existApp;
                $window.firebase.apps.forEach(function (app) {
                    if (app.name.toLowerCase() === dbName.toLowerCase()) {
                        existApp = app;
                    }
                });

                if (!existApp) {
                    existApp = $window.firebase.initializeApp(config, dbName);
                }
                return existApp;
            }

            return userResultsService;
        }
    ]);
})(angular);
