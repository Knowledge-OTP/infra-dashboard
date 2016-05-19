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

            this.$get = ['$injector', 'ENV', function($injector, ENV) {

                var GroupsService = {
                    defaultGroupName: 'assorted'
                };
                var authSrv = $injector.get(AuthSrvName);
                var storageSrv = $injector.get(StorageSrvName);
                var GROUPS_PATH = storageSrv.variables.appUserSpacePath + '/groups';
                var teacherGroups = {};

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
                    return storageSrv.get(GROUPS_PATH, groupsDefault()).then(function (groups) {
                        teacherGroups = groups;
                        return teacherGroups;
                    });
                };

                GroupsService.moveToGroup = function (toGroupKey, studentIdsArr) {
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

                GroupsService.setGroup = function (id, newGroup) {
                    var self = this;
                    return this.getAllGroups().then(function (groups) {
                        groups[id] = newGroup;
                        return self.setGroups(groups);
                    });
                };

                GroupsService.getGroup = function (id) {
                    return this.getAllGroups().then(function (groups) {
                        return groups[id];
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
                    return GroupsService.getGroup(groupKey).then(function (group) {
                        group.name = newName;
                        return GroupsService.setGroup(groupKey, group);
                    });
                };

                GroupsService.addGroupsListener = function (eventName, callback) {
                    var authData = authSrv.getAuth();
                    if (authData && authData.uid) {
                        var fullPath = ENV.fbDataEndPoint + ENV.firebaseAppScopeName + '/' + GROUPS_PATH;
                        var groupsFullPath = fullPath.replace('$$uid', authData.uid);
                        var ref = new Firebase(groupsFullPath);

                        if (angular.isFunction(callback)) {
                            ref.on(eventName, callback);
                        }
                    }
                };

                GroupsService.removeGroupsListener = function (eventName, callback) {
                    var authData = authSrv.getAuth();
                    if (authData && authData.uid) {
                        var fullPath = ENV.fbDataEndPoint + ENV.firebaseAppScopeName + '/' + GROUPS_PATH;
                        var groupsFullPath = fullPath.replace('$$uid', authData.uid);
                        var ref = new Firebase(groupsFullPath);

                        if (angular.isFunction(callback)) {
                            ref.off(eventName, callback);
                        }
                    }
                };

                function groupsDefault() {
                    var _groupsDefault = {};
                    _groupsDefault[GroupsService.defaultGroupName] = {
                        name: GroupsService.defaultGroupName,
                        groupKey: GroupsService.defaultGroupName
                    };
                    return _groupsDefault;
                }

                return GroupsService;

            }];
        }
    ]);
})(angular);

