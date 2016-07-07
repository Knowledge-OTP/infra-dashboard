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

(function (angular) {
    'use strict';

    angular.module('znk.infra-dashboard.groups', []);
})(angular);

(function (angular) {
    'use strict';

    angular.module('znk.infra-dashboard.groups').provider('GroupsService', [
        function () {

            var StorageSrvName;
            var AuthSrvName;

            this.setHelpersServiceName = function (storageServiceName, authServiceName) {
                StorageSrvName = storageServiceName;
                AuthSrvName = authServiceName;
            };

            this.$get = ['$injector', 'ENV', '$q', '$log', function($injector, ENV, $q, $log) {

                var GroupsService = {
                    defaultGroupName: 'assorted'
                };
                var authSrv = $injector.get(AuthSrvName);
                var storageSrv = $injector.get(StorageSrvName);
                var GROUPS_PATH = storageSrv.variables.appUserSpacePath + '/groups';
                var groupChangeCbArr = [];
                var groupChildAddedCbArr = [];

                function groupsDefault() {
                    var _groupsDefault = {};
                    _groupsDefault[GroupsService.defaultGroupName] = {
                        name: GroupsService.defaultGroupName,
                        groupKey: GroupsService.defaultGroupName
                    };
                    return _groupsDefault;
                }
                
                function getGroupsRef() {
                    var authData = authSrv.getAuth();
                    var fullPath = ENV.fbDataEndPoint + ENV.firebaseAppScopeName + '/' + GROUPS_PATH;
                    var groupsFullPath = fullPath.replace('$$uid', authData.uid);
                    return new Firebase(groupsFullPath,  ENV.firebaseAppScopeName);
                }
                var groupsRef = getGroupsRef();

                GroupsService.createGroup = function (groupName) {
                    var self = this;
                    return self.getAllGroups().then(function (groups) {
                        var increment = 1;
                        var groupId = GroupsService.defaultGroupName;

                        if(Object.keys(groups).length){
                            groupId = Object.keys(groups).length + increment;
                        }

                        while (angular.isDefined(groups[groupId])){
                            increment++;
                            groupId = Object.keys(groups).length + increment;
                        }

                        groups[groupId] = {
                            name: groupName,
                            groupKey: groupId
                        };

                        return self.setGroups(groups);
                    });
                };

                GroupsService.updateStudent = function (groupKey, studentId, newStudent) {
                    if(!groupKey){
                        $log.error('GroupsService.updateStudent:: student group key not defined');
                        return $q.reject('student group key not defined');
                    }
                    var self = this;
                    return self.getGroup(groupKey).then(function (studentGroup) {
                        if (!newStudent) {
                            delete studentGroup.students[studentId];
                        } else {
                            studentGroup.students[studentId] = newStudent;
                        }

                        return self.setGroup(groupKey, studentGroup).then(function () {
                            return self.getAllGroups();
                        });
                    });
                };

                GroupsService.getAllGroups = function () {
                    return storageSrv.get(GROUPS_PATH, groupsDefault());
                };

                GroupsService.moveToGroup = function (toGroupKey, studentIdsArr) {
                    if(!toGroupKey){
                        $log.error('GroupsService.moveToGroup:: to group key not defined');
                        return $q.reject('to group key not defined');
                    }
                    var self = this;
                    return self.getAllGroups().then(function (allGroups) {
                        var movedStudents = {};

                        angular.forEach(studentIdsArr, function (studentId) {
                            angular.forEach(allGroups, function (group) {
                                if(group.students && group.students[studentId]){
                                    movedStudents[studentId] = group.students[studentId];
                                    delete  group.students[studentId];
                                }
                            });
                        });

                        if(!allGroups[toGroupKey].students) {
                            allGroups[toGroupKey].students = {};
                        }

                        angular.forEach(studentIdsArr, function (studentId) {
                            allGroups[toGroupKey].students[studentId] = movedStudents[studentId];
                        });

                        return self.setGroups(allGroups);
                    });
                };

                GroupsService.setGroups = function (newGroups) {
                    return storageSrv.set(GROUPS_PATH, newGroups);
                };

                GroupsService.setGroup = function (groupKey, newGroup) {
                    if(!groupKey){
                        $log.error('GroupsService.setGroup:: group key not defined');
                        return $q.reject('group key not defined');
                    }
                    var self = this;
                    return this.getAllGroups().then(function (groups) {
                        groups[groupKey] = newGroup;
                        return self.setGroups(groups);
                    });
                };

                GroupsService.getGroup = function (groupKey) {
                    return this.getAllGroups().then(function (groups) {
                        return groups[groupKey];
                    });
                };

                GroupsService.deleteGroup = function (groupKey) {
                    return GroupsService.getAllGroups().then(function (groups) {
                        var students = angular.copy(groups[groupKey].students);
                        delete groups[groupKey];

                        angular.forEach(students, function (student, key) {
                            groups[GroupsService.defaultGroupName].students[key] = student;
                        });

                        return GroupsService.setGroups(groups);
                    });
                };

                GroupsService.editGroupName = function (groupKey, newName) {
                    if(!groupKey){
                        $log.error('GroupsService.editGroupName:: group key not defined');
                        return $q.reject('group key not defined');
                    }
                    return GroupsService.getGroup(groupKey).then(function (group) {
                        group.name = newName;
                        return GroupsService.setGroup(groupKey, group);
                    });
                };

                groupsRef.on('value', function(snapShot){
                    var groupsNewValue = snapShot.val();
                    //update storage groups
                    GroupsService.getAllGroups().then(function(groups){
                        var groupsKeys = Object.keys(groups);
                        groupsKeys.forEach(function(key){
                            if(groupsNewValue && !groupsNewValue[key]){
                                delete groups[key];
                            }
                        });

                        if(groupsNewValue){
                            var newGroupKeys = Object.keys(groupsNewValue);
                            newGroupKeys.forEach(function(key){
                                groups[key] = groupsNewValue[key];
                            });
                        }

                        groupChangeCbArr.forEach(function(cb){
                            cb(groups);
                        });
                    });
                });

                groupsRef.on('child_changed', function(snapShot){
                    var groupsNewValue = snapShot.val();
                    GroupsService.getAllGroups().then(function(allGroups){
                        var allGroupsStudents = 0;
                        var newGroupStudents = 0;

                        if(allGroups[groupsNewValue.groupKey] && allGroups[groupsNewValue.groupKey].students){
                            allGroupsStudents = Object.keys(allGroups[groupsNewValue.groupKey].students).length;
                        }

                        if(groupsNewValue && groupsNewValue.students){
                            newGroupStudents = Object.keys(groupsNewValue.students).length;
                        }

                        if(newGroupStudents > allGroupsStudents) {
                            angular.forEach(groupsNewValue.students, function (student) {
                                if(!allGroups[groupsNewValue.groupKey].students || !allGroups[groupsNewValue.groupKey].students[student.receiverUid]){
                                    groupChildAddedCbArr.forEach(function(cb){
                                        cb(student);
                                    });
                                }
                            });
                        }
                    });
                });

                GroupsService.addGroupsChangeListener = function (callback) {
                    GroupsService.getAllGroups().then(function(groups){
                        callback(groups);
                    });
                    groupChangeCbArr.push(callback);
                };

                GroupsService.removeGroupsChangeListener = function (callback) {
                    var cbIndex = groupChangeCbArr.indexOf(callback);
                    if(cbIndex !== -1){
                        groupChangeCbArr.splice(cbIndex, 1);
                    }
                };

                GroupsService.addGroupsChildAddedListener = function (callback) {
                    groupChildAddedCbArr.push(callback);
                };

                GroupsService.removeGroupsChildAddedListener = function (callback) {
                    var cbIndex = groupChildAddedCbArr.indexOf(callback);
                    if(cbIndex !== -1){
                        groupChildAddedCbArr.splice(cbIndex, 1);
                    }
                };


                return GroupsService;

            }];
        }
    ]);
})(angular);


angular.module('znk.infra-dashboard.groups').run(['$templateCache', function($templateCache) {

}]);

(function (angular) {
    'use strict';

    angular.module('znk.infra-dashboard.modal', []);
})(angular);

'use strict';

(function (angular) {

    function ModalService() {

        var baseTemplateUrl;

        this.setBaseTemplatePath = function(templateUrl) {
            baseTemplateUrl = templateUrl;
        };

        this.$get = ['$mdDialog', function($mdDialog) {
            var ModalService = {};

            ModalService.showBaseModal = function (popupData) {
                $mdDialog.show({
                    locals: {
                        svgIcon: popupData.svgIcon,
                        innerTemplateUrl: popupData.innerTemplateUrl,
                        overrideCssClass: popupData.overrideCssClass,
                        modalData: popupData.modalData,
                        modalName: popupData.modalName,
                        closeModal: function closeModal (){
                            $mdDialog.hide();
                        }
                    },
                    bindToController: true,
                    controller: popupData.controllerName,
                    controllerAs: 'vm',
                    templateUrl: baseTemplateUrl,
                    clickOutsideToClose: true,
                    escapeToClose: true
                });
            };

            return ModalService;
        }];
    }

    angular.module('znk.infra-dashboard.modal').provider('ModalService', ModalService);

})(angular);



angular.module('znk.infra-dashboard.modal').run(['$templateCache', function($templateCache) {

}]);

(function (angular) {
    'use strict';

    angular.module('znk.infra-dashboard.userResults', []);
})(angular);

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

            return userResultsService;
        }
    ]);
})(angular);

angular.module('znk.infra-dashboard.userResults').run(['$templateCache', function($templateCache) {

}]);

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
