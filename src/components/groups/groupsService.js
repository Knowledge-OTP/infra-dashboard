(function (angular) {
    'use strict';

    angular.module('znk.infra-dashboard.groups').provider('GroupsService', [
        function () {

            var StorageSrvName;

            this.setStorageServiceName = function (storageServiceName) {
                StorageSrvName = storageServiceName;
            };

            this.$get = ['$injector', function($injector) {

                var GroupsService = {};
                var defaultGroupName = 'assorted';

                function _getStorage(){
                    return $injector.get(StorageSrvName);
                }

                function _getGroupPath(){
                    return _getStorage().variables.appUserSpacePath + '/groups';
                }

                GroupsService.createGroup = function (groupName) {
                    var self = this;
                    return _getStorage().get(_getGroupPath()).then(function (groups) {
                        var increment = 1;
                        var groupId = Object.keys(groups).length + increment;
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
                    return _getStorage().get(_getGroupPath());
                };

                GroupsService.moveToGroup = function (fromGroupKey, toGroupKey, studentIdsArr) {
                    var self = this;
                    return self.getGroup(fromGroupKey).then(function (fromGroup) {
                        var movedStudents = {};

                        angular.forEach(studentIdsArr, function (studentId) {
                            movedStudents[studentId] = fromGroup.students[studentId];
                            delete fromGroup.students[studentId];
                        });

                        return self.setGroup(fromGroupKey, fromGroup).then(function () {
                            return self.getGroup(toGroupKey).then(function (toGroup) {
                                if (!toGroup.students) {
                                    toGroup.students = {};
                                }
                                angular.forEach(studentIdsArr, function (studentId) {
                                    toGroup.students[studentId] = movedStudents[studentId];
                                });

                                return self.setGroup(toGroupKey, toGroup).then(function () {
                                    return self.getAllGroups();
                                });
                            });
                        });
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
                            groups[defaultGroupName].students[key] = student;
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

                return GroupsService;

            }];
        }
    ]);
})(angular);

