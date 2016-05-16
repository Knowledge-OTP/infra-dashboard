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

            this.$get = ['$injector',  'ENV', '$timeout', '$q', function($injector, ENV, $timeout, $q) {

                var GroupsService = {
                    defaultGroupName: 'assorted',
                    groups: {}
                };

                GroupsService.createGroup = function (groupName) {
                    var self = this;
                    return _getStorage().get(_getGroupPath()).then(function (groups) {
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
                    return $q.when(GroupsService.groups);
                };

                GroupsService.moveToGroup = function (fromGroupKey, toGroupKey, studentIdsArr) {
                    var self = this;
                    return self.getAllGroups().then(function (allGroups) {
                        var movedStudents = {};

                        angular.forEach(studentIdsArr, function (studentId) {
                            movedStudents[studentId] = allGroups[fromGroupKey].students[studentId];
                            delete  allGroups[fromGroupKey].students[studentId];
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
                    return _getStorage().set(_getGroupPath(), newGroups);
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

                function _getAuthSrv(){
                    return $injector.get(AuthSrvName);
                }

                function _getStorage(){
                    return $injector.get(StorageSrvName);
                }

                function _getGroupPath(){
                    return _getStorage().variables.appUserSpacePath + '/groups';
                }

                function addGroupListener() {
                    var authData = _getAuthSrv().getAuth();
                    if (authData && authData.uid) {
                        var ref = new FirebaseListenerRef(authData.uid);
                        ref.on('child_added', groupsChildAdded);
                        ref.on('child_removed', groupsChildRemoved);
                    }
                }

                function groupsChildAdded(dataSnapshot) {
                    $timeout(function () {
                        GroupsService.groups[dataSnapshot.key()] = dataSnapshot.val();
                    });
                }

                function groupsChildRemoved(dataSnapshot) {
                    $timeout(function () {
                        delete GroupsService.groups[dataSnapshot.key()];
                    });
                }

                function FirebaseListenerRef(uid) {
                    var fullPath = ENV.fbDataEndPoint + ENV.firebaseAppScopeName + '/' + _getGroupPath();
                    var groupsFullPath = fullPath.replace('$$uid', uid);
                    return new Firebase(groupsFullPath);
                }

                addGroupListener();

                return GroupsService;

            }];
        }
    ]);
})(angular);

