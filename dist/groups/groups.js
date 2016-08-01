(function (angular) {
    'use strict';

    angular.module('znk.infra-dashboard.groups', ['znk.infra.storage']);
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

            this.$get = ['$injector', 'ENV', '$q', '$log', 'StorageSrv', function($injector, ENV, $q, $log, StorageSrv) {

                var GroupsService = {
                    defaultGroupName: 'assorted'
                };
                var authSrv = $injector.get(AuthSrvName);
                var storageSrv = $injector.get(StorageSrvName);
                var GROUPS_PATH = StorageSrv.variables.appUserSpacePath + '/groups';
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

                GroupsService.getUserData = function(uid){
                    var found = false;
                    var studentObj = {};
                    return storageSrv.get(GROUPS_PATH, groupsDefault()).then(function(groups){
                        angular.forEach(groups, function (group) {
                            if (!found && group.students && group.students[uid]){
                                found = true;
                                studentObj = group.students[uid];
                            }
                        });
                        return studentObj;
                    });
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
